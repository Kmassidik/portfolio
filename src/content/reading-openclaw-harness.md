---
title: Anatomy of a harness — reading OpenClaw's source, part by part
date: 2026-08-15
excerpt: The agent loop is the smallest part of an agent. I read the biggest open-source harness there is — OpenClaw — part by part: where the model stops and your code starts, what a tool-call receipt actually contains, how the loop decides it is stuck, and how the context window is treated like a budget. My own harness stays private. This is the public one, read properly.
tags: ai, agents, llm, tool-calling, harness, open-source, inference, self-hosted
---

I have been building my own agent harness for a while now, and I am not going to
show it to you. That is partly shyness and partly the fact that it is a work
in progress, and it is a decision I will keep making for a while.

But here is the thing about harnesses: they are not secret. Every design
decision in mine shows up, somewhere, in somebody else's public repository.
OpenClaw is the biggest one I know of — an open-source assistant that runs on
your own devices and talks to you through Discord, iMessage, Slack, Telegram,
WhatsApp and twenty other channels. Its repository is enormous and, more
importantly, it is *legible*. Someone clearly thought about the boundaries.

So this is the post I wanted to write instead of showing mine: a proper read of
OpenClaw's source, part by part, mapped onto the things a harness has to
decide. Everything here is checkable — every path I mention is in the repo,
and I link to the files.

### Why read somebody else's harness

First, because the harness is worth more than most people think it is.

The cleanest evidence is a benchmark that holds the model fixed and swaps the
harness. Terminal-Bench scores agents on real terminal tasks, and its
maintainers ship a neutral reference agent called Terminus — one tool, an
interactive tmux session, any model through LiteLLM. Run the same weights in
Terminus and in the vendor's own CLI and the gap is not small.

| Model | Terminus 2 | Vendor harness | Gap |
| --- | --- | --- | --- |
| GPT-5.4 mini | 36.9% | 66.1% (Codex CLI) | **+29.2** |
| GPT-5.4 | 54.8% | 77.3% (Codex CLI) | +22.5 |
| Claude Opus 4.6 | 63.8% | 70.1% (Claude Code) | +6.3 |
| Gemini 3.1 Pro | 70.7% | 67.1% (Gemini CLI) | −3.6 |

Same weights. Twenty-nine points. That is bigger than the gap between many
adjacent model generations, and it is not a model property at all.

Two things to take from the table. The gap can be enormous. And it is not
always in the vendor's favour — Gemini 3.1 Pro does *better* in the neutral
Terminus than in Gemini CLI, because a harness is tuned to a model, a task
distribution and a set of habits, and it can be tuned wrong.

The trap, which I now put in front of every model score I read: **a
leaderboard row is a (model, harness, environment, budget) tuple.** Quoting
"model X scores Y" without the harness is quoting half a result.

### The nine things a harness has to decide

Before the source, the shape. A harness is all the non-model code and text
that sits between a model and the world. The model is a function from a token
sequence to a probability over the next token; everything else decides what
sequence goes in, turns some of what comes out into actions, and decides when
to call the model again.

Nine responsibilities, and OpenClaw has a directory for each:

| What it decides | Where it lives in OpenClaw |
| --- | --- |
| The system prompt and the tool descriptions | `src/agents/system-prompt*.ts` |
| Turning generated text into a tool call | `src/agents/embedded-agent-runner/run/attempt-tool-call-*.ts` |
| Actually running the thing | `src/process/exec-runner.ts` |
| What gets re-sent, truncated or summarised | `src/context-engine/` |
| Memory files the model reads every session | `src/memory/root-memory-files.ts` |
| What may run without asking, and inside what walls | `src/agents/agent-tools.before-tool-call.*.ts`, `src/hooks/` |
| When to stop | `src/agents/tool-loop-detection.ts` |
| Undo, and rolling back a bad edit | `src/snapshot/` |
| What the human gets to see | `src/trajectory/`, `src/session-cards/` |

That last column is the useful part. When you know a codebase's vocabulary,
you can read its decisions. OpenClaw's own architecture note puts it plainly:
the runtime lives in `src/agents/`, transport in `src/llm/`, and plugins are
only allowed through `openclaw/plugin-sdk/*` barrels — they do not import
`src/**` internals. That boundary is enforced by code, which is the whole
point.

### Where the model stops and your code starts

This is the part I expected to be simple and wasn't.

![One tool call, end to end. The model proposes a call. A parser turns the generated text into a structured tool call, repairing the JSON when the model gets it wrong. A policy stage decides whether the call is allowed, denied, or needs a human approval. Your code executes it. The result is folded back into the context. The trust boundary sits between the policy stage and execution: every decision on that boundary is written to a receipt before the tool runs.](/blog/harness-tool-call.svg)

Look at the third box: **policy**. Not "the model was asked to be careful". Not
"the system prompt says be careful". A code path that decides.

And look at where the boundary is drawn. It is *before* execution, not after.
The moment that matters is not "what did the tool do" — it is "was this call
allowed to happen at all".

### Every decision leaves a receipt

I did not expect this and I now think it is the single best idea in the
codebase.

In `src/agents/agent-tools.before-tool-call.decision.ts`, every tool action
gets a **receipt**. It is not a log line. It is a structured record, with a
content-addressed id:

```
receiptId = sha256(contextId, executionId, toolCallId, descriptor, reasonCode)
```

hashed, base64url, truncated to 32 characters. Alongside it:

```
schemaVersion, occurredAt, action,
decision:  { outcome, reasonCode },
enforcement: { coverageState, policyRefs, grantRefs, contextFieldsUsed },
source: { owner, recordRef, decisionBoundary: "agent-tool.before-execute" },
missingEvidence, remediation
```

Read `decisionBoundary` again: `agent-tool.before-execute`. The receipt is
written *before* the tool runs. You are not auditing what happened after the
fact; you are recording the authorisation itself.

There is a subtlety I like even more. The decision function is wrapped in an
`AsyncLocalStorage` scope that tracks whether an owner-native decision record
was already registered, so the generic fallback does not double-write a
decision that a more specific owner already recorded. One decision, one
receipt — even when four layers of policy all have an opinion.

This is the same seam I described in [the agents post](/blog/from-answering-to-doing-agents):
the model can only *propose*, the harness *disposes*. OpenClaw just writes the
disposal down, with a hash, so you can prove later what was authorised and by
which rule.

### The parser repairs the model's mistakes

Next to the loop, the file that taught me the most:
`run/attempt.tool-call-argument-repair.ts`. 582 lines, and the entire reason
it exists is that models emit broken JSON in tool calls.

The constants tell the story:

```ts
const MAX_TOOLCALL_REPAIR_BUFFER_CHARS = 64_000;
const MAX_TOOLCALL_REPAIR_LEADING_CHARS = 96;
const MAX_TOOLCALL_REPAIR_TRAILING_CHARS = 3;
const TOOLCALL_REPAIR_SMART_QUOTES = new Set(["\u201c", "\u201d", "\u201e", "\u201f"]);
```

Curly quotes. That is the bug. Models cheerfully write `{"path": “src/main.ts”}`
and a strict JSON parser throws, so the tool call never happens and the agent
sits there. The repair layer normalises them, trims leading and trailing
garbage, and — this is the part I would not have guessed — keeps a **whitelist
of known argument keys** (`cmd`, `command`, `cwd`, `path`, `old_str`,
`new_str`, `pattern`, `query`, …) so a repaired blob can be matched to a tool
whose schema it was probably meant for.

None of this is exotic. All of it is load-bearing, because a tool call that
fails to parse is a turn that produces nothing but an error message.

And it is not a theoretical problem. When I ran my first hand-written loop
against SmolLM2-360M, the tool description said `TOOL: list_files DIR`, and
the model asked for a directory literally named `DIR`. Eight times in a row.
The model never reads your tool's code — it reads your tool's *name*, your
*schema*, and your *description*. Everything you would tell a junior engineer,
you have to tell the model instead.

### Deciding that the loop is stuck

`src/agents/tool-loop-detection.ts` is 760 lines, and it is the most
interesting file in the repository to me, because stopping is the hardest
problem in agent design.

It recognises six kinds of stuck:

| Detector | What it catches |
| --- | --- |
| `generic_repeat` | the same tool, the same arguments, over and over |
| `argument_churn` | the same tool, arguments that keep changing |
| `unknown_tool_repeat` | calling a tool that does not exist |
| `known_poll_no_progress` | a polling tool that is never going to resolve |
| `global_circuit_breaker` | everything else, eventually |
| `ping_pong` | two tools calling each other forever |

with thresholds named in the file: `TOOL_LOOP_WARNING_THRESHOLD = 10`,
`UNKNOWN_TOOL_THRESHOLD = 10`, `CRITICAL_THRESHOLD = 20`,
`GLOBAL_CIRCUIT_BREAKER_THRESHOLD = 30`, over a `TOOL_CALL_HISTORY_SIZE = 30`
window.

The clever part is how it decides two failures are *the same* failure. It
hashes tool outcomes — but strips volatile fields first. Delivery IDs, debug
keys, memory-search internals: all removed before hashing, so "the same error
with a different request id" hashes the same and still counts as a repeat. If
you do not strip those fields you will never detect the loop, because every
iteration looks new.

There is also a separate idea for the `exec` tool: real terminal failures may
legitimately repeat with fresh arguments, so only a *contiguous* tail of typed
failures counts as no-progress. And argument-validation rejections — calls
that never ran — neither extend nor end a failure streak, because they never
executed.

This is the same shape as the step cap I insist on in my own harness, with a
lot more care about the definition of "same". The cap is the easy half.

### Context is a budget, not a buffer

`src/context-engine/bounded-context.ts` is eighty lines and does something I
found genuinely instructive.

It bounds the model view by walking the message list **backwards**, adding up
bytes and estimated tokens until it hits `maxBytes`. Then it cuts — but not
anywhere. It cuts at a `user` message, because you cannot leave a `tool_use`
behind without its `tool_result`: the model would see a request with no
answer and, reasonably, get confused. The file calls the helper
`classifyToolUseResultPairing` and walks past any frame whose result was
dropped, so the cut never orphans a call.

Two details I would not have written myself:

- The comment *"Ordinary token pressure still belongs to semantic
  compaction"* — this bounded view is a last resort, not the primary
  mechanism. If you are routinely hitting the byte budget, you are compacting
  at the wrong layer.
- The cut is fingerprinted: `sha256` over the projection, the budget, the
  message before the cut, the retained messages and the system prompt
  addition. That fingerprint becomes an `epoch` of `thread_bootstrap`. And the
  reason is stated in the code: *"Persistent backends must replace the old
  native context, not append a bounded view to a thread that still contains
  the omitted messages."*

That is a bug class you only find in production. If you store the bounded
view alongside the full history, the model sees every message twice — once
through the projection and once through the store — and you spend tokens on
ghosts.

### The inference engineer's view

Here is where this stops being an architecture post and becomes my job.

An agent re-sends its entire prompt every turn. The system prompt and the tool
list are the prefix, and if that prefix is byte-identical between turns, the
engine can reuse its cached keys and values and only prefill the new tail.
OpenClaw treats this as a first-class concern: there are five separate
modules under `embedded-agent-runner/` for it — `google-prompt-cache.ts`,
`prompt-cache-history.ts`, `prompt-cache-retention.ts`,
`prompt-cache-observability.ts`, `prompt-cache-request-observer.ts` — plus
secret-redaction sentinels so a cached prefix never leaks a credential.

I measured the same effect on my own box: a repeated 3,064-token context with
2,548 tokens of prefix reused went from **4.54 s to 1.07 s time to first
token — 4.2×**. And the wasteful version is the default. A single agent
conversation costs about **4.6× more than the tokens it actually produced**,
and by turn eight that multiplier is **13.6×**.

The harness decides this. Whether the prefix is stable is a property of how
you assemble the prompt, not of the model. If you edit the tool list, or
interleave the volatile part before the stable part, you throw the cache away
on every single request — and you will never see it in the latency number
that got you fired, because the number just looks like "slow".

One more, because it connects two posts. The harness also decides the **edit
format**. Aider measured this on its laziness benchmark — 89 Python
refactoring tasks — where GPT-4 Turbo scored **20% with search/replace blocks
and 61% with unified diffs**. Same model, same harness, different wire
format. And on my own ternary endpoint, free n-gram speculation ran a code
rewrite at **51–53 tok/s against a 33 tok/s baseline**, which means a
whole-file rewrite is cheaper than the raw tok/s figure suggests. Two posts
ago I wrote that the model only proposes and your code disposes. The edit
format is the same seam: the model proposes *text*, your code decides what
that text means.

### What I took from it, and what I did not

My own harness stays private, so take this as one person's reading of
somebody else's code rather than a comparison.

What I took:

- **The receipt.** I log every step, but I log it as lines. A content-addressed
  decision record with an explicit `decisionBoundary` field is strictly better,
  and I am going to copy that shape.
- **Volatile-field stripping before hashing.** I had no idea this was a
  problem until I read it, and it is the kind of thing that silently makes a
  loop detector useless.
- **Never orphan a `tool_use` from its `tool_result`.** I have the bug. I
  did not know it was a bug.
- **The fingerprint/epoch on the bounded view.** Same reason.

What I did not take: the scale. This repository is enormous, and the
authoritative runtime is split across `src/agents/` and
`packages/agent-core/`, with dozens of files per concern. Some of that is
legitimate — a harness that runs unattended for weeks on twenty chat channels
needs more moving parts than one that runs for ten turns in a terminal. Some
of it is just what happens when a project gets popular.

And the thing I keep coming back to: **the harness is half the agent, and the
other half is the tool descriptions.** Anthropic put it plainly in *Building
effective agents* — "we actually spent more time optimizing our tools than the
overall prompt" — and the Terminal-Bench table is the receipt. SWE-agent named
the idea formally: the agent-computer interface deserves the same design care
we give human-computer interfaces. And mini-swe-agent, from the same group,
gets over 74% on SWE-bench Verified with about a hundred lines of Python and
nothing but bash.

A small, predictable harness around a strong model can match a heavy one. It
is also much easier to debug, and much easier to evaluate. That is the whole
argument.

Next in this series: [From answering to doing: how agents actually
work](/blog/from-answering-to-doing-agents) — the loop itself, what tool
calling really is, and the four guardrails I will not ship an agent without.

### Further reading

- [OpenClaw](https://github.com/openclaw/openclaw) — the repository this is a reading of
- [Why OpenClaw](https://docs.openclaw.ai/start/why-openclaw) — the architecture case: trusted gateway, untrusted execution, policy enforced by code
- [Agent runtime architecture](https://github.com/openclaw/openclaw/blob/main/docs/agent-runtime-architecture.md) — the runtime layout table, from the project itself
- [`run-loop.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/embedded-agent-runner/run-loop.ts) — the attempt loop
- [`tool-loop-detection.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/tool-loop-detection.ts) — the six stuck-detectors and their thresholds
- [`bounded-context.ts`](https://github.com/openclaw/openclaw/blob/main/src/context-engine/bounded-context.ts) — cutting context without orphaning a tool call
- [`agent-tools.before-tool-call.decision.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/agent-tools.before-tool-call.decision.ts) — the decision receipt
- [Terminal-Bench](https://tbench.ai) — the benchmark behind the harness-effect table
- [SWE-agent](https://arxiv.org/abs/2405.15793) — the agent-computer interface paper
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — the workflow/agent line, and the tools-first advice
