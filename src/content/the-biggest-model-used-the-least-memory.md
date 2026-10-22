---
title: The biggest model used the least memory
date: 2026-10-08
excerpt: Forty renders, four models, one 8 GB card. FLUX has 12 billion parameters and peaks at 2.57 GB, while Qwen has 7 billion and peaks at 7.10 GB. Offload turns model size into time instead of memory, SDXL cannot spell, and none of the four can count to three.
tags: ai, image-generation, diffusion, benchmarking, gpu, self-hosted
---

The table looks like a mistake.

FLUX.1-dev has 12 billion parameters and peaks at 2.57 GB. Qwen-Image 2.1 has
7 billion and peaks at 7.10 GB. Both ran on the same 8 GB card, through the same
offload path, at the same resolution.

### The run

Ten prompts across six skills, 1024 by 1024, 30 steps, one model on the card at
a time. Each model rendered the whole suite, was unloaded, and the card was
freed before the next one loaded. Forty renders, each timed and measured.

Qwen ran bf16 here for a fair cross-model comparison. Its production config is
int8 plus the KV cache, which is a different number and a different post.

| Model | Architecture | Median | Peak VRAM |
|---|---|---|---|
| SD3.5 Medium | MMDiT, 2.5B | 99.7 s | 3.03 GB |
| SDXL 1.0 | UNet, 2.6B | 109.0 s | 4.04 GB |
| FLUX.1-dev | DiT, 12B | 518.1 s | 2.57 GB |
| Qwen-Image 2.1 | DiT, 7B | 615.1 s | 7.10 GB |

![Parameters and peak VRAM for the four models. FLUX has the longest parameter bar and the shortest memory bar. Qwen has the tallest memory bar.](/blog/model-memory.svg)

### Model size is not memory when the model is streamed

On a card smaller than the model, the weights are not resident. Sequential
offload holds them in system RAM and streams the active layer in, one at a time.
The peak is set by the largest slice that has to be on the card at once, plus
activations, plus the decode.

FLUX is almost five times the parameters of SD3.5 and uses slightly less memory
than SDXL. Its slices are the smallest. The bill is not memory. It is 518
seconds per image, against 100 for SD3.5.

That is the trade on 8 GB, and it is worth saying without decoration. Offload
lets you run a model that does not fit. It does not make it fast. It converts a
memory problem into a time problem, and time is the currency you actually spend.

### Where the field splits: text

This was the clearest result, and it is architectural rather than a matter of
taste.

Three of the four render text. SDXL does not.

A coffee sign reading "MORNING BREW" came back from SDXL as "MORING BREW", one
dropped letter. A chalkboard reading "TODAY: FRESH PASTA $12" came back as
"TPAED PAJSTA… TJAY PASSTA", which is noise shaped like letters.

SDXL is a UNet with a CLIP text encoder. It was never trained to lay glyphs out,
so it produces letter-shaped texture. Qwen, FLUX and SD3.5 are diffusion
transformers with much stronger text encoders, and they treat the words in the
prompt as something to typeset.

If the image needs to contain readable words, that one difference decides the
model.

### Portraits are solved, hands are almost, counting is not

**Portraits.** All four are convincingly photographic. Qwen reads most natural,
FLUX and SD3.5 most cinematic, SDXL holds its own. This is no longer a
differentiator.

**Hands.** Asked for one hand with five separated fingers, Qwen produced one
clean hand. FLUX was good. SDXL produced two hands with extra and elongated
fingers. SD3.5 drew two hands, which is a prompt-adherence miss rather than an
anatomy failure.

**Counting.** None of them passed. Asked for exactly three red apples and two
green pears, Qwen drew 2 and 2, FLUX 2 and 1, SDXL about four mixed, SD3.5 three
mixed. Not one produced the exact count. A diffusion model has no symbolic
notion of three.

**Style and scene.** All four handled anime, cityscape, product shots, fantasy
and landscape well. The gap between the cheapest and the most expensive model is
much smaller here than the price suggests.

### The verdict is a decision, not a ranking

| If you need | Pick | Why |
|---|---|---|
| Fast drafts | SD3.5 Medium | 100 s, light, good text |
| Lowest memory | FLUX.1-dev | 2.57 GB, but about 8.5 minutes |
| Text, hands, adherence | Qwen-Image 2.1 | best quality, 10 minutes at bf16 |
| Photoreal or art, no words | SDXL 1.0 | fast and fine, until text or fingers appear |

Qwen is the quality pick and the slowest one here. In production it runs int8
plus the KV cache at 0.8 GB peak and 365 seconds, so the 7.10 GB figure in the
table is the reference-precision cost, not the deployed one. The other three
have no equivalent path wired up in this app.

### What this does not tell you

- **Ten prompts, one render each.** This is a qualitative head-to-head, not a
  statistical study. It can show a missing letter. It cannot estimate a win
  rate.
- **Seeds are fixed within a model, not across models.** The same seed does not
  mean the same starting noise in two different architectures.
- **Qwen ran bf16.** Its production int8 plus KV config is faster and much
  lighter, so its row is the fairest for comparison and the least
  representative of what I actually serve.
- **No step or feature caching.** That is the 1.5 to 2× lever for any of these,
  and it is deliberately off because the brief was quality first.
- **One card and one resolution.** 1536 px is allowed by the catalog and was not
  part of this run.
- **"Best" here means text, hands and prompt adherence.** It is not a claim
  about which picture you will like.

The biggest model was the cheapest in memory and the most expensive in time. On
a small card those are the same decision, paid in different currency.

### Further reading

- [FLUX.1](https://github.com/black-forest-labs/flux), the 12B model that needed the least memory.
- [Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206), Esser et al., the SD3 paper behind the MMDiT family.
- [Qwen-Image](https://github.com/QwenLM/Qwen-Image), the model that won on text and hands, and cost the most time.
- [Diffusers memory optimization](https://huggingface.co/docs/diffusers/optimization/memory), for the offload and tiling settings every row here used.
