---
title: RAG, and why retrieval beats fine-tuning for facts
date: 2026-04-11
excerpt: The pipelines half of the promise from the first AI post here. What retrieval-augmented generation actually is, the pipeline stage by stage, and the decision rule I keep coming back to: facts belong in retrieval, behaviour belongs in the weights. Measured on my own box, not borrowed from a paper.
tags: ai, rag, llm, retrieval, embeddings, fine-tuning, self-hosted, inference
---

The [first post](/blog/why-i-build-with-llms) here ended on a promise: before I get
into agents and pipelines. This is the pipelines half.

It is also the half I got wrong first. My first attempt at teaching a model our
internal docs was to fine-tune it on them. It worked, in the way that a thing
which works badly still works. Then I built the retrieval version and put both
side by side, and the retrieval one won by about 2.6× on the questions that
actually mattered. That result reorganized how I think about the whole problem,
so I want to write it down properly.

### The thing fine-tuning was never going to be good at

Here is the distinction that made the difference, and it is small enough to fit
in one sentence: **a model's weights hold what it read during training, and
nothing else.**

Not your wiki. Not last week's incident. Not the number on page 40 of a PDF
that did not exist when the run finished. When you fine-tune on a corpus, you
are not giving the model a copy of it. You are asking the model to absorb it
into a few billion numbers, and then you hope the specific facts you cared
about survived the compression. Sometimes they do. When the corpus updates,
and it updates constantly, you do the whole thing again.

Retrieval does something much less clever. It leaves the facts where they
already are, in text, and fetches the right ones at question time.

### What RAG actually is

Retrieval-augmented generation is the plumbing that fetches the right passage
at question time and hands it to the model to read. The model is not
"trained on your data". It is handed a couple of thousand words on every
question, and it answers from those words.

The whole pipeline, stage by stage:

1. **Chunk.** Split the corpus into passages small enough to be retrieved and
   large enough to still mean something.
2. **Embed.** Turn each chunk into a vector, so that "how do I rotate a key" and
   "where is the credential rotation procedure" land near each other.
3. **Retrieve.** For the question, embed it the same way and find the nearest
   chunks. This is the stage that is fast and cheap and wide.
4. **Rerank.** Take the top few candidates and score them properly. This is the
   stage that is slow and precise and narrow.
5. **Ground.** Put the surviving chunks in the prompt, with instructions to
   answer from them and to say so when the answer is not in them.

![Three ways to give a model a fact, side by side. Fine-tune the weights: the fact lives in the weights, changes when you retrain, and cannot cite a source. Retrieve at query time: the fact lives in the context, changes when you re-index, and can cite the passage. Paste it all in: the fact lives in the window, changes on every request, and cannot cite a source. Below, the measured result: on knowledge questions, retrieval beat closed-book fine-tuning by about 2.6 times.](/blog/rag-decision.svg)

### The numbers, from my own box

I did not want to take this on faith from a blog post, so I built it and
measured it. The corpus was 677 chunks, embedded with BGE-small, and searched
with exact cosine and no approximate index, because the corpus was small enough
that the exact answer was affordable and I did not want an ANN (approximate
nearest neighbour) index quietly hiding error in my baseline.

Two numbers came out, and they are the whole story:

| Metric | Measured | In plain words |
| --- | --- | --- |
| **recall@1** | **75%** | the single top hit is the right chunk three times in four |
| **recall@5** | **93.3%** | the right chunk is in the top five about fourteen times in fifteen |

Read them together and they tell you how to configure retrieval. recall@1 of
75% means that grounding on the single best chunk drops the answer one time in
four. recall@5 of 93.3% means widening to five passages recovers almost all of
that. The answer is *there*, and now the generator's job is to find it in the
context.

The 18-point gap between those two numbers is exactly what a reranker is
trying to capture. The bi-encoder gets you a wide net of candidates. The
cross-encoder takes the five you kept and reorders them so the right one is
first.

### The decision rule I keep coming back to

All three of these put more information in front of the model. They differ in
**where** the information lives and what that costs.

| The gap | Reach for | Why |
| --- | --- | --- |
| Convention, format, style: "sound like us, answer in this shape" | fine-tune | behaviour is diffuse; it belongs in the weights, and a small LoRA teaches it cheaply |
| Knowledge, facts: "know our docs, cite them, stay fresh" | RAG | facts change and need provenance; retrieval injects and cites them without retraining |
| Open-ended, hard reasoning: "think through something genuinely difficult" | rent the frontier model | when capability, not knowledge, is the bottleneck, a bigger model beats any local trick |

The measured result is the one I remember: when the task was *recalling facts*,
teaching those facts by closed-book fine-tuning lost to simply retrieving them,
by about 2.6×. That is the empirical backbone of "facts belong in retrieval."

And notice what the result does **not** say. Fine-tuning did not fail at its
job. It was asked to do retrieval's job. If I had asked it to be more concise,
or to use our house style, or to always answer in JSON with these keys, it
would have won, easily, and it is still the right tool for all of those.

### Where long-context fits

"Just paste it all into a 262k window" is a fourth option and sometimes the
right one, which is a single large document that fits and is used once. It is not a
substitute for retrieval at scale. You pay prefill for every token on every
request. You hit *lost in the middle* on the facts that are buried. And you
cannot cite a passage or update it independently.

The relationship is the opposite of what people assume: **RAG is long-context's
index.** It decides which few thousand tokens are worth the model's attention.
Retrieve *to* a long window, don't retrieve *instead of* thinking about the
window.

### How it breaks

Three failures, and I have hit all three:

- **Bad chunking.** recall is low even though the fact is definitely in the
  corpus, because it got split across a boundary or drowned inside a giant
  chunk. Fix the chunking before you touch anything else.
- **Lost in the middle.** The right chunk was retrieved and the model ignored
  it, because it sat in the middle of the context where models attend worst.
  The fix is fewer, better chunks and putting the strongest passages at the
  start and end of the context.
- **Hallucination despite context.** The answer was confident and wrong, with
  good chunks right there in the prompt. This one is a prompt problem, not a
  retrieval problem: ground it, and give it an explicit way to abstain.

That third one is why "cite your sources" is not a style preference. A model
told to cite is measurably less likely to invent, because every claim now
needs a home. The "say so" clause is the abstention valve that stops the model
filling a retrieval miss with a guess.

### The part I own: serving it

Retrieval quality is the AI engineer's problem. Serving it fast is mine, and
RAG is unusually sensitive to it because the prompt shape is unusual: system
instructions, then retrieved chunks, then the question.

The retrieved passages and the system prompt are a long shared prefix across
many requests. Prefill that context once and cache it, and you skip
recomputing it every single time. I measured up to 2.1× on long shared
prefixes. The catch is that it only fires when the prefix is byte-identical,
so keep your chunk ordering stable and put the volatile part, the question,
last.

The other two levers are less fun. Every query needs an embedding before
retrieval can even start, and I measured 279 chunks/s on the box, with the
embedder sharing the card with the generator, so it competes for the same
memory and the same compute. And the latency budget is a sum: embed, search,
rerank, prefill, decode. Each stage is a slice of the SLA, and the prefill of
a large retrieved context is usually the fat slice, which is exactly why the
prefix caching pays.

### The honest part

Two things worth saying plainly.

**RAG is not magic, and the retriever is the ceiling.** Every downstream
number. The answer quality, the faithfulness and the citation are all bounded by
recall@k. If the retriever misses it, no amount of prompt engineering will
recover it. Measure the retriever first, on its own, before you tune anything
else. Retrieval and generation are two different systems with two different
metrics, and people constantly let the good one hide the bad one.

**And it is plumbing, not intelligence.** Everything I have described here is
boring on purpose. Chunking, embeddings, cosine similarity, a second model for
reranking, a prompt that says "answer from these and cite them". The
interesting part was never the technique. It was figuring out which problem I
actually had. Facts or behaviour. That one question decides the whole
architecture, and it is worth getting right before you build anything.

Next in this series: [a guided read of OpenClaw's source](/blog/reading-openclaw-harness),
which covers the harness that turns a retrieval pipeline into an agent, and
where the model's authority actually ends.

### Further reading

- [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401), the original paper
- [Lost in the Middle](https://arxiv.org/abs/2307.03172), the U-shaped curve that makes more context worse
- [BGE-small](https://huggingface.co/BAAI/bge-small-en-v1.5), the embedding model I measured with
- [BEIR](https://github.com/beir-cellar/beir), the benchmark suite for comparing retrievers
- [Ragas](https://github.com/explodinggradients/ragas), evaluating RAG without a human in the loop
- [Rerankers](https://www.pinecone.io/learn/series/rag/rerankers/), the clearest explanation of stage 4
- [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval), chunking that fixes a lot of chunking problems
