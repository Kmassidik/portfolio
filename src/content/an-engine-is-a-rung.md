---
title: An engine is a rung, not a name
date: 2026-09-20
excerpt: vLLM, SGLang, llama.cpp, TensorRT-LLM, diffusers, ComfyUI. They are not competitors, they are occupants of different rungs, and comparing them as one list is why the question feels unanswerable. The map, the two generation loops, and the measured numbers: 3,029 tokens per second against 291 at sixteen concurrent, 460 GB of weights across PCIe for one video render, and 61 audio models in one C++ binary.
tags: ai, inference, llm, vllm, sglang, llama-cpp, self-hosted, benchmarking
---

The [harness read](/blog/reading-openclaw-harness) ended with a section called
the inference engineer's view, and the question I kept getting afterwards was
the simple one: which engine.

I tried to answer it with a comparison table, and the table misbehaved
immediately. The names in the question are not alternatives. vLLM and CUDA are
not competitors, they are three rungs apart. ComfyUI and PyTorch are not
competitors, one calls the other. Sort the names by rung and the landscape
shrinks to something a person can hold.

### Six rungs, repeated once per vendor

![The inference stack as six rungs. Rung 5 is serving, rung 4 is the engine, rung 3 is the framework, rung 2 is the compiler, rung 1 is the metal, rung 0 is the silicon. TensorRT sits on the compiler rung and TensorRT-LLM on the text engine rung. Triton the kernel language is on the compiler rung while Triton Inference Server is on the serving rung.](/blog/engine-rungs.svg)

Every rung exists once per silicon vendor, which is why "build from metal" and
"build for AMD" are different axes. The deeper the rung, the less portable it
is. A CUDA kernel is welded to NVIDIA. A Python script is cargo that any
locomotive can pull.

Two names are worth fixing in your head, because they are four rungs apart and
share a name. Triton is OpenAI's kernel language, at rung 2. Triton Inference
Server is NVIDIA's serving layer, at rung 5. They are unrelated projects, and
everyone loses an afternoon to this exactly once.

And TensorRT is not an engine. It is a compiler. NVIDIA's engine is
TensorRT-LLM, one rung above it. That distinction matters, because it is the
reason TensorRT-LLM cannot enter the comparison below without changing the
experiment.

### Two loops, two different hard problems

Engines split into families, and the split is physical rather than marketing.

An autoregressive engine emits one token at a time and keeps a key-value cache
that grows with every token. Its hard problem is storing and paging that cache
across many concurrent requests, which is what PagedAttention and RadixAttention
exist for.

A diffusion engine pushes the whole latent tensor through a fixed number of
denoising passes. Nothing accumulates between passes, so there is no cache to
page. Its hard problem is fitting one enormous activation and moving the weights
past the card on every step. On this box, a 23-step render moves about 460 GB
across PCIe before a single frame is decoded.

| | text engine | diffusion engine |
|---|---|---|
| loop | one token at a time | 4 to 49 full passes |
| core trick | the KV cache | fitting the activation |
| moves per unit of output | one token of state | the entire model, once per step |
| what to patch | the decode loop | the attention call, the offload hook |

### The text engines, measured

Four engines, one card, one model, 16-bit everywhere, the other two GPUs
watched to prove they were idle. Measured 2026-09-13.

| Engine | Alone | First token | Card mem | Host mem |
|---|---|---|---|---|
| Ollama | 297.5 | 11.2 ms | 1,091 MB | 739 MB |
| llama.cpp | 283.6 | 13.7 ms | 1,255 MB | 635 MB |
| vLLM | 312.9 | 33.1 ms | 6,979 MB | 1,294 MB |
| SGLang | 374.9 | 49.8 ms | 7,253 MB | 5,434 MB |

297.5, 283.6, 312.9, 374.9 tokens per second. A 1.3× spread, from four teams
with four different goals, and none of them near the 584 tokens per second the
hardware could do. What separates them at one user is how much overhead each
leaves behind, and they have all removed most of it.

If one person is using the model, the choice barely matters. That deserves
saying plainly, because almost all writing about serving engines is aimed at
people who will never have a second user.

With a crowd, it is a different table.

| Engine | 4 at once | 8 at once | 16 at once | Shape |
|---|---|---|---|---|
| Ollama | 285.8 | | 291.0 | flat, does not batch |
| llama.cpp | 862.4 | | 772.6 | fills four slots, then queues |
| vLLM | 955.9 | | 3,029.1 | keeps climbing |
| SGLang | 1,106.5 | 2,069.0 | 357.8 | peaks at eight, then falls |

![Total throughput against concurrent requests. vLLM climbs from 956 tokens per second at four to 3,029 at sixteen. SGLang rises to 2,069 at eight and collapses to 358 at sixteen. llama.cpp sits at 862 and 773. Ollama stays flat near 290.](/blog/engine-throughput.svg)

Every shape is a design decision. Ollama does not batch, so sixteen users get
what one user got, divided sixteen ways. llama.cpp has four slots, fills them,
then queues the rest. vLLM re-forms the batch every step, so a finishing request
frees its slot at once, and nothing measured here stopped it climbing. SGLang
records command sequences for batches of 1, 2, 4 and 8, is the fastest of the
four at eight, and at sixteen has no recording left to replay. It runs without
them and drops to a tenth of its speed. That is not a quality problem. It is a
design decision meeting a workload it was not built for.

And they mostly agree on what to say, which is the column that makes this a
comparison rather than a race. Four prompts at temperature 0, hashed. Three of
the four are byte-identical across all four engines, across two file formats and
a number-format conversion. On the code prompt, three agree with each other and
Ollama differs, at the third token. The first version of that check hashed one
prompt and announced that everything agreed. One in four did not.

That is also why the memory column has to be two columns. The two C++ engines
land near 1.8 GB combined. The two Python engines carry a deep learning
framework before serving anybody, and SGLang's host memory alone is 8.6×
llama.cpp's. On this box that is nothing, 5.4 GB out of 125. On a 16 GB server
it decides whether the engine starts.

### The image engine, and what standing lower buys

The image project started as a ComfyUI user and ended as the author of its own
two-phase pipeline on diffusers, with ComfyUI removed from the machine. Nothing
below the engine rung changed during that migration, which is what a layered
stack is supposed to permit.

The reason shows up inside one transformer block. From a node graph you can
change the settings that surround the loop: steps, resolution, seed. From
diffusers and PyTorch you can replace the attention call and the block-offload
hook, which is where the actual problem lives. Every parallelism strategy in
that project is a patch installed there, then a call into the same unchanged
pipeline. A node graph exposes the arguments around the loop, never the loop.

The bill arrives as upstream bugs that a higher rung would have hidden. An
offload flag that pins tens of gigabytes of host RAM and gets the process killed
with no traceback. A block-level hook with a known upstream issue. Neither is
visible from a node graph, and neither is avoidable once the graph is gone.

### The audio engine, and sixty-one models in one binary

The audio project went the other way and refused the engine question entirely.
One C++ program, GGUF weights, 61 model families, no Python at any point, a
919 MB binary. That is what makes its model comparisons mean anything. Clone
three repositories and you measure three frameworks, three kernel sets and three
packaging schemes along with the models.

It also produced the cleanest example of a default pretending to be a hardware
limit. Speech over a minute looked impossible on 8 GB. The cause was a text
chunk size defaulting to 8,192 characters, larger than any realistic prompt, so
nothing ever chunked. One flag moved the wall. The other time, a
"non-deterministic engine" turned out to be a random seed that had never been
set.

### TensorRT-LLM, and why there is no number here

TensorRT-LLM is a real engine, and it is deliberately absent from the table
above.

TensorRT compiles a model into one optimised NVIDIA build at rung 2.
TensorRT-LLM wraps that into an engine at rung 4, and it builds its engine for
one model, one precision and a set of maximum shapes before it serves anything.
That is a genuine advantage. It is also a different experiment: the comparison
above holds everything constant except the engine, and a per-model build step
breaks that constraint. I have no number for it on this card, so I am not going
to put one next to llama.cpp and call it a comparison. If you need the last few
percent on NVIDIA hardware and can afford the build matrix, benchmark it
yourself.

### Every engine claim is dated

This is the fastest-moving layer in the stack, and the honest way to read the
map is with dates on it.

The clearest example is one this project wrote down and then had to correct. An
earlier version of the image notes said engines stay family-specific and that
text and diffusion never cross. As of August 2026, SGLang, built for text
serving, also serves a diffusion video model, and vLLM was adding a path. What
converged is the infrastructure around the loop: schedulers, batching, memory
pools, the API. The loops are still different machines. So the question is never
which family an engine belongs to. It is what that engine supports in the
release you can install today.

### Four questions for the next new name

1. Which rung is it on? If it owns a loop, rung 4. If it batches requests, rung 5.
2. Which vendor column, and does it have a bogie? Triton, ONNX and Vulkan are the three places a tool changes gauge cheaply.
3. Which loop does it belong to, and what does this release actually support?
4. What can you patch from there? If the thing to fix is inside the loop, standing outside it will not do.

Question four is the one that decided both of the projects above, and it is the
only one a benchmark cannot answer for you.

### The short answer

If one person is using it, Ollama or llama.cpp, and it barely matters. If
several are, vLLM until something measured says otherwise. If the model is
bigger than the card, llama.cpp, because it is the only one of the four that
will. If you are rendering video, the engine is not the interesting choice, the
rung is. And if the thing you need to change lives inside the loop, no engine
choice will save you. That is when you write one.

### Further reading

- [Efficient Memory Management for LLM Serving with PagedAttention](https://arxiv.org/abs/2309.06180), Kwon et al., SOSP 2023. Why the engines that batch well take most of the card at startup, and why that reservation is the batching rather than a cost of it.
- [Fast and Expressive LLM Inference with RadixAttention and SGLang](https://www.lmsys.org/blog/2024-01-17-sglang/), LMSYS. The radix-tree prefix cache from its authors, and the workloads where a shared prefix wins.
- [llama.cpp](https://github.com/ggml-org/llama.cpp), ggml-org. The only one of the four that will run a model larger than the card, and the engine behind the GGUF format.
- [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM), NVIDIA. The engine built on the compiler this post says TensorRT is.
- [diffusers](https://github.com/huggingface/diffusers), Hugging Face. The library the image pipeline stands on once the node graph is gone.
- [audio.cpp](https://github.com/0xShug0/audio.cpp), 0xShug0. One binary, sixty-one model families, which is why its model comparisons are comparisons of models.
