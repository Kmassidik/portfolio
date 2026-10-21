---
title: Why I build with LLMs, and what text generation was before
date: 2025-12-08
excerpt: Into 2025 and 2026 I moved off the servers and the soldering iron and into AI engineering. Before I touch the fancy stuff, here is the honest version of what a text-generation model actually is, what we used before it, why the new way won, and why I still bolt retrieval onto it. The five Ws and the one H, no hype.
tags: ai, llm, nlp, rag, text-generation, machine-learning, self-hosted, career
---

The radio bridge was the last thing I built with a soldering iron on the bench.
The stretch after it, through 2025 and into 2026, I spent somewhere with no
hardware at all: AI engineering. This is the first post about it, so before I get
into agents and pipelines and all the rest, I want to lay down the honest
foundation. What this thing actually is, what we had before it, and why I build
the way I do.

One scope note up front, because "AI" has turned into a word that means
everything and therefore nothing. I'm only going to talk about one slice of it:
**text generation**. Not images, not speech, not video, not robots, not AGI. Just
this: you hand a machine some words, and it hands you back sensible words. That's
the whole territory for this post. Everything below is the five Ws and the one H
of that, and nothing more.

### What it actually is

A text-generation model does exactly one thing, and it is far less mystical than
the marketing makes it sound. It reads the text so far and guesses what comes
next, one token at a time. A token is roughly a word or a piece of one. It picks
the next one, sticks it on the end, and reads the whole thing again to pick the
one after that.

That's it. The whole probability of a sentence is just that guess, made over and
over and multiplied together:

$$P(w_1, w_2, \dots, w_n) = \prod_{t=1}^{n} P(w_t \mid w_1, \dots, w_{t-1})$$

Read that right to left in plain words: the chance of the next word depends on
every word that came before it. A model that's good at text generation is just a
model that's good at that one conditional guess. Everything clever it appears to
do, answering, summarizing, writing code, is that single next-token bet running
in a loop.

### Who came before: the alternative

This is the part people skip, and it's the part that makes the rest make sense. We
did not always have this. For decades, text generation was built a completely
different way, and I think you only appreciate why the modern approach matters
once you've seen what it replaced.

![Two ways to generate text side by side. On the left, the classical pipeline: input text goes into hand-written rules and an n-gram table, which drives a fixed template to produce output. On the right, the LLM: input text is split into tokens, a transformer predicts the next token using the full context, and that loop produces the output.](/blog/nlp-vs-llm.svg)

The old way, classical NLP, leaned on three kinds of thing:

- **N-gram models.** Count how often words follow other words in a big pile of
  text, then predict the next word from the last few. Cheap, fast, and everywhere
  before the deep-learning era.
- **Rule and template systems.** A human writes the grammar and the fill-in-the-blank
  templates by hand. The machine just slots values in. Reliable, and completely
  incapable of surprising you.
- **Early sequence-to-sequence nets.** The first neural translators and
  summarizers, which worked but forgot the start of a long sentence by the time
  they reached the end.

Here's the thing that kills the n-gram version, and it's the same formula from
above with one brutal shortcut. Instead of conditioning on every previous word, it
only looks at the last few:

$$P(w_t \mid w_1, \dots, w_{t-1}) \approx P(w_t \mid w_{t-n+1}, \dots, w_{t-1})$$

That approximation *is* the limitation. Set $n$ to 3 and the model literally cannot
remember anything more than two words back. It has no idea what the paragraph is
about. That's why old chatbots lost the thread so fast, and why rule systems felt
like talking to a vending machine. The context just wasn't there to use.

### Why the modern way won

The LLM keeps the shortcut off. A transformer conditions the next token on the
*whole* context it's been given, not a three-word window, and it learns the
patterns from data instead of from a human writing rules by hand. Those two
changes are the entire story of why this generation of models can do what the old
ones couldn't.

No more rule farming. Nobody hand-writes the grammar. No more amnesia at word
four. The model holds the thread across a whole document. And because it learned
general patterns rather than memorizing specific templates, it handles inputs
nobody wrote a rule for. That last part is the one that actually changed my job.
The old way could only answer questions someone had anticipated. This one
generalizes.

### Why I still bolt RAG onto it

So the model is fluent and it holds context. Here's the catch, and it's the catch
that pays my bills. The model only knows what was in its training data, frozen at
the moment training stopped. Ask it about your internal docs, your product, last
week, and it will not say "I don't know." It will make something up, fluently and
confidently. That's the hallucination everyone complains about, and it isn't a
bug so much as the model doing its one job, guessing the next likely word, with no
facts to anchor the guess.

RAG, retrieval-augmented generation, is the fix, and it's less clever than the
acronym suggests. Before the model answers, you go fetch the actual relevant
documents and paste them into its context. Then it answers from those, not from a
frozen memory.

But "go fetch the relevant documents" is carrying a lot of weight in that
sentence, and that's exactly where the real system design lives. Here's the shape
I actually build.

![The RAG pipeline in two lanes. Offline and built once: documents are chunked, each chunk is embedded into a vector, and the vectors are stored in a vector store. Online and run on every question: the question is embedded and used to retrieve the top-K candidate chunks from the vector store, a re-ranker narrows those to the top-N most relevant, and those chunks plus the question go to the LLM, which writes a grounded answer.](/blog/rag-pipeline.svg)

There are two halves. The **offline** half runs once, whenever the documents
change: split each document into chunks, turn every chunk into a vector with an
embedding model, and store those vectors. The **online** half runs on every single
question: embed the question the same way, pull the closest chunks out of the
store, and hand the best of them to the model.

That word "best" is where most naive RAG falls over, and it's why there are two
retrieval stages, not one.

### Two stages, because one isn't enough

The first stage is **retrieval**, and it optimizes for recall: do not miss the
chunk that holds the answer. It uses a **bi-encoder**, which embeds the question
and every document separately and scores them by cosine similarity,

$$\text{sim}(q, d) = \frac{\mathbf{e}_q \cdot \mathbf{e}_d}{\lVert \mathbf{e}_q \rVert \, \lVert \mathbf{e}_d \rVert}$$

Because the document vectors are computed ahead of time, this is just vector math
at query time, so it scales to millions of chunks and stays fast. The catch is that
encoding the two sides apart is a little lossy. It's great at pulling back a wide
net of maybe-relevant chunks, say the top 50, but the single best one isn't
reliably sitting at the top.

![Bi-encoder versus cross-encoder. The bi-encoder encodes the question and a document separately into two vectors and compares them with cosine similarity, which can be precomputed and scales to millions but is coarse. The cross-encoder feeds the question and document in together and lets the model attend across both to produce one relevance score, which is far more accurate but has to run fresh for every pair.](/blog/encoder-compare.svg)

The second stage is **re-ranking**, and it optimizes for precision: put the truly
best chunk first. It uses a **cross-encoder**, which feeds the question and a chunk
in *together* and lets the model attend across both before scoring,

$$s = \text{CrossEncoder}(q, d)$$

This is far more accurate, because nothing is encoded in isolation, but it can't be
precomputed and costs a full model pass per pair. So you never run it over the
whole corpus. You run it only on the 50 candidates the retriever already found, and
it reorders them down to the 5 that actually go into the prompt.

Recall first, precision second. The retriever makes sure the answer is *somewhere*
in the candidates, the re-ranker makes sure it's at the *top*, and only then does
the LLM see anything. The model's answer is never better than the chunks you feed
it, so this ordering step is not a nice-to-have. Garbage in the context, garbage
out of the model.

That's the fuller version of the trick. Retrieve wide, re-rank tight, then
generate, with the surviving chunks sitting right there in the context the model
conditions on. The fluency comes from the LLM. The facts come from your documents.
And the unglamorous truth is that almost all of the engineering, and almost all of
the quality, lives in the retrieval and the re-ranking, not in the model at the
end.

### How and where I run it

The same way I run everything else here: on my own metal. I've never put any of
this on a managed cloud, and I wasn't about to start because it had the letters AI
in it. An open-weights model, a vector store for the retrieval side, and the whole
thing sitting on hardware I can touch. The data doesn't leave, the bill doesn't
surprise me, and when it breaks it breaks somewhere I can actually get at it. For
the kind of work I do, where the documents going into the retriever are often the
whole reason the thing is sensitive, keeping it self-hosted isn't a preference,
it's the point.

### The honest part: the old way still wins sometimes

I'm not here to tell you the classical approach is dead. It isn't, and reaching for
an LLM when you don't need one is its own kind of mistake. If the task is small,
fixed, and has to be exactly right every time, a rule or a template still beats a
language model flat. It's deterministic, it's auditable, it runs on nothing, and it
never hallucinates because it never guesses. I've shipped a regex where a junior
engineer wanted a model, and it was the right call.

The LLM earns its keep when the input is open-ended and you could never write all
the rules in advance. That's the line I draw. Modern when the problem is genuinely
open, classical when it's genuinely closed.

And again: this is only text generation. One slice. The rest of what gets called
AI is a different post, or several. But this is the foundation under all of it, and
I wanted the first one to be the honest version rather than the magic one.

Next in this series: [RAG, and why retrieval beats fine-tuning for
facts](/blog/why-rag-beats-fine-tuning) — the pipelines half of this promise,
including the measurement that rearranged how I think about it.

### Further reading

- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/), still the clearest picture of how the modern model actually attends to context
- [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401), the original RAG paper
- [n-gram language models](https://web.stanford.edu/~jurafsky/slp3/3.pdf), the Jurafsky and Martin chapter, for how the old way counted
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762), the transformer paper that turned the context window all the way up
- [Nearest-neighbor and vector search](https://en.wikipedia.org/wiki/Nearest_neighbor_search), the retrieval half of RAG that does most of the real work
