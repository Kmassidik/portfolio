---
title: The crash happened at the last step
date: 2026-10-04
excerpt: Seven minutes of clean denoising, then an out-of-memory error on the final pass, in the one part of a diffusion render nobody watches. The VAE decode is the real memory peak, the error was fragmentation rather than shortage, and the fix cost no quality.
tags: ai, image-generation, diffusion, gpu, debugging, self-hosted
---

A render that dies at the start costs a minute. A render that dies at the end
costs seven, and the log points at the wrong thing.

The first time I loaded the official Qwen-Image 2.1 on the 8 GB card, it
denoised for about seven minutes without a complaint. The card sat at 1.4 GB
the whole time. Then it failed on the last step, with a message that starts like
a shortage and ends like a diagnosis.

```
CUDA out of memory. 5.19 GiB allocated by PyTorch, 1.90 GiB reserved but
unallocated. Try PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
```

The interesting number is the second one.

### The denoise is not the expensive part

The 7B transformer never lands on the card. Sequential CPU offload keeps the
weights in 125 GB of system RAM and streams them layer by layer, so only the
active layer is resident. During the 30 denoising steps the card holds about
1.4 GB, and it holds it flat.

Everyone watches that number. It is the one that shows up in `nvidia-smi` for
the whole render, and it is comfortable on an 8 GB card.

Then the loop ends and the latent has to become pixels. The VAE decode runs
once, and it wants the whole 1024 by 1024 image at the same time. That is the
peak, and it happens after the part that looked safe.

![Memory through one render. The line ramps to 1.4 GB during loading, stays flat across all thirty denoising steps, then spikes to 7 GB for the single VAE decode pass, just under the 8 GB ceiling.](/blog/crash-timeline.svg)

### Reserved but unallocated is not a shortage

Read the error as arithmetic. 5.19 GiB allocated plus 1.90 GiB reserved and
unallocated is 7.09 GiB on an 8 GB card. PyTorch owned that 1.90 GiB. It could
not hand it over in one contiguous block of the size the decode asked for.

So the card was not full. It was fragmented.

That distinction matters because the fixes are different. A model that genuinely
does not fit needs a smaller model, more offload, or a smaller canvas. A
fragmented allocator needs permission to grow a segment instead of demanding
one contiguous block, which is exactly what the error message suggests.

### Three changes, and none of them touch a pixel

**1. `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`.** This cleared the
crash on its own. The allocator can extend a segment instead of requiring a new
contiguous range, so the decode no longer needs a hole that does not exist.

**2. `torch.cuda.empty_cache()` after every job, success or failure.** A failed
render had left 7.4 GB stranded on the card. In a worker that loads the model
once and keeps it, the next job inherits that. The cleanup went in a `finally`
block, where it runs whether the render worked or not.

**3. VAE tiling and slicing.** This is the structural fix rather than the
allocator fix. The decode is split into tiles so the peak is bounded by the
tile, not by the full image. It also made the higher resolutions reachable
without another crash.

The service unit now carries the first as an environment variable, and the
worker calls the other two when it loads a pipeline:

```ini
Environment=PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
```

```python
pipe.enable_sequential_cpu_offload()
pipe.enable_vae_tiling()
pipe.enable_vae_slicing()
```

None of these change an output pixel. They change where memory sits and when it
is freed.

### The speed came from somewhere else

It would be tidy to say the fix made the render faster. It did not. The repair
made it survive.

The speed came from precision, measured separately:

| Config | Render | Peak VRAM |
|---|---|---|
| bf16 | 470 s | ~7 GB, crashed once |
| int8 | 385 s | 1.4 GB |
| int8 + KV cache | 365 s | 0.8 GB |

int8 is **18% faster** with an identical image, and not because integer maths is
quicker. The compute is still bf16. It is faster because the model is streamed,
and int8 halves the bytes crossing PCIe on every step. On an offloaded model the
bus is the bottleneck, so a smaller file is a shorter wait.

The bf16 row is the one from this story. It completed after the allocator fix,
and it still peaked near 7 GB because the decode was still doing the whole image
at once. Tiling is what brings the peak down for the runs that followed.

### A resident worker makes every leak permanent

The worker loads the model once. That is the point: 3 seconds for bf16 through
mmap, 36 seconds for int8 because it quantises on the way in. Paying that per
image would be absurd.

The cost is that nothing resets between jobs. A crashed render used to leave
7.4 GB behind, and the next job, which had done nothing wrong, would fail on a
card that looked occupied. `empty_cache()` in `finally` is not defensive
programming. It is the only thing separating one bad job from every job after
it.

The queue helps at the edges. A failed job is marked failed with its error,
truncated to 400 characters, instead of being left as running. A job interrupted
by a restart is marked failed when the worker starts, rather than sitting in the
queue as a lie. And the unit uses `KillMode=mixed` with a 600 second stop
timeout, so a restart lets the render in hand finish instead of throwing away
seven minutes of work.

### What this does not tell you

- **This is one card, one model, one resolution.** The catalog allows up to
  1536 px, and that is a different memory profile.
- **The timings are not a clean before and after.** 470, 385 and 365 seconds are
  three precision configurations, not three attempts at the same one.
- **Tiling trades a little speed for a bounded peak.** The decode is batched
  differently, so its timing is not directly comparable to the untiled run.
- **A fragmentation crash is the good kind of out of memory.** The model fits.
  The allocator just needed room to grow.

The expensive crash is the one that happens after the work is done. Instrument
the last step, not only the loop.

### Further reading

- [PyTorch CUDA memory management](https://pytorch.org/docs/stable/notes/cuda.html), including `expandable_segments` and the difference between allocated, reserved and free memory.
- [Diffusers memory optimization](https://huggingface.co/docs/diffusers/optimization/memory), where VAE tiling and slicing are documented as decode-time fixes rather than quality settings.
- [Qwen-Image](https://github.com/QwenLM/Qwen-Image), the model whose pipeline exposed the decode peak in the first place.
