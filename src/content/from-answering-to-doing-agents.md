---
title: From answering to doing: how agents actually work
date: 2026-10-21
excerpt: The follow-up I promised. What an agent actually is (a loop, not a smarter model), what tool calling really is (the model proposes, your code disposes), why the loop compounds capability and error at the same time, and the guardrails that make one shippable. No hype.
tags: ai, agents, llm, tool-calling, ai-engineering, self-hosted
---

[The last post here](/blog/why-i-build-with-llms) ended on a promise: before I get
into agents and pipelines. The pipelines half is still queued. The agents half
stopped being optional in
December, when AI engineering stopped being something I did in the evenings and
became the job title on the business card. Ten months in, this is the honest
version of what an agent actually is — and the first thing to know is that it is
less than the marketing says, and more useful than that sounds.

### What it actually is

An agent is not a model. There is no "agent model" to download, and none of the
agent frameworks you've seen are smart; they're plumbing. An agent is a pattern
you build around the same text-generation model from the previous post. Three
parts:

- **A model** that can, instead of only writing text, ask for something to be
  done.
- **Tools**, which are just functions you wrote, with names and argument schemas
  the model knows about.
- **A loop** that runs the model, executes whatever it asked for, pastes the
  result back, and repeats until the model answers the question instead of
  asking for another tool.

That's the whole idea. Everything else — frameworks, protocols,
autonomous-sounding product names — is decoration on that loop. In pseudocode,
it fits in ten lines:

```python
context = [task]
while True:
    reply = model(context, tools=TOOLS)
    if reply.wants_tool:
        result = run(reply.tool, reply.args)  # your code runs it, not the model
        context += [reply, result]
    else:
        return reply.text
```

If you've ever written a while loop, you've already written the hard part of an
agent. The rest of the engineering is about not letting it fall over.

### Tool calling, demystified

The part that looks like magic is the least magical thing in the system. The
model never runs anything. You advertise your functions to it — names, argument
schemas, what each one is for — and the model, which is still just predicting
tokens, emits a structured call: this tool, these arguments, as JSON. Your code
validates that JSON, executes the actual function, and pastes the result back
into the context as text. As far as the model is concerned, nothing has ever
left the realm of text. It is still guessing the next token; it just happens to
be fluent in a grammar of tool calls.

Internalize that, because it tells you exactly where the trust boundary is. The
model can only *propose*; the harness — your code — *disposes*. If a tool can
drop a database, the model can ask for a database drop as many times as it
likes, and nothing happens unless your executor is willing to do it. Every
security story in agents lives at that seam, and I'll come back to it in the
guardrails.

### Why the loop changes anything

So if the model is the same, why does bolting a loop onto it matter? Because
the model from [the previous post](/blog/why-i-build-with-llms) could only
*answer*. Ask it to "find every invoice over $500 from last quarter and draft a
chase-up email for each" and it produces a plausible essay about invoices. The
knowledge is there; the ability to act is not. A bare LLM is a very well-read
advisor who is not allowed to touch anything.

The loop gives it hands. Retrieval — [the RAG setup from last
time](/blog/why-i-build-with-llms) — becomes one tool among several: search the
docs, query the database, call the API, check the calendar. The model plans in
text, acts through tools, reads what happened, and plans again. Tasks where you
can't pre-write the steps — because you don't know what step three is until
step two's result comes back — become tractable. That is the honest definition
of "agentic": open-ended tasks, *executed*, not just described.

![The agent loop. A task enters your harness, the model either calls one of your tools and the result is pasted back into its context, or it answers without a tool call and the loop ends. Guardrails wrap the loop: a step cap, a tool allowlist, human approval for side effects, and a log of every step.](/blog/agent-loop.svg)

### The loop is also the failure mode

Here is the math I would pin above every agent project. Say each step of the
loop — decide, call the tool, read the result — succeeds with probability
$p$. A task that takes $k$ steps then succeeds with

$$P(\text{task}) = \prod_{i=1}^{k} p_i \approx p^k$$

Ninety percent per step sounds great, until the task needs ten steps:
$0.9^{10}$ is about 35%. That single line is the whole demo-to-production gap.
Demos are short; week two is when the tasks get long and the multiplied
probabilities eat you alive. Almost all the engineering I do on agents is about
moving those two numbers: shrink $k$, by giving the model better tools so one
good call replaces four clumsy ones, and raise $p$, by validating the arguments
before executing and returning useful error messages so the model recovers
instead of thrashing.

### The guardrails that make it shippable

The loop runs unattended, so the harness has to be the adult. Four guardrails I
will not ship an agent without:

- **A step cap.** A hard maximum on iterations. A confused agent does not get to
  spin forever burning tokens; it fails, loudly, and a human looks at the log.
- **A tool allowlist.** The model only sees tools appropriate to the task at
  hand. Least privilege, the same way you'd give a junior engineer an email
  address but not production credentials.
- **Approval for side effects.** Anything that writes, sends, deletes, or costs
  money stops and asks a human first. Read-only tools run free; everything else
  waits.
- **A log of every step.** Every decision, every tool call, every result,
  persisted. When it goes wrong — and it will — that log is your stack trace.
  An agent without a step log is undebuggable by construction.

### The honest part: most tasks still aren't agent-shaped

Same line as last time, same conclusion. If the task is closed — the same shape
every time, every step knowable in advance — a plain function beats an agent
flat, for the same reasons a template beat a language model: deterministic,
auditable, runs on nothing. I've replaced proposed agents with a script and a
cron entry, and it was the right call every time. The agent earns its keep when
you genuinely cannot write the steps in advance. Modern when the problem is open,
classical when it's closed — except now it has hands.

One thing I under-rated: testing. Unit tests assume the same input gives the
same output. An agent that picks its own path hands you the same input and a
*legitimately different* path. Evaluations — grading whole-loop runs against a
set of scenarios — are the replacement, and they are younger and cruder than
unit tests. Closing that gap is the current frontier of the job, and it's
probably the next post in this series.

### Further reading

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629), the paper that named this loop
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), the clearest argument for staying boring
- [Model Context Protocol](https://modelcontextprotocol.io), the emerging standard for advertising tools
- [OpenAI function calling guide](https://platform.openai.com/docs/guides/function-calling), the schemas, concretely
