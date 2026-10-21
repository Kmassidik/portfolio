---
title: Your logs say it worked, the eval says it was wrong
date: 2026-10-21
excerpt: The follow-up the agents post promised. An agent can finish 90% of its tasks and still be wrong on half of them, and the log line that proves it never fires. How I built a scored eval on tasks no public model has seen, why the answer key has to be computed at run time, and why one of my three model rankings did not survive a significance check. All of it measured on one card.
tags: ai, agents, llm, evaluation, ai-engineering, self-hosted
---

The [agents post](/blog/from-answering-to-doing-agents) ended on a confession:
unit tests do not fit an agent that picks its own path, and evaluations are the
replacement, younger and cruder than the tests they replace. I said closing that
gap was probably the next post. This is that post, and it starts with a number
that still bothers me.

### The same run, two different scores

An agent can complete 90% of its tasks and be wrong on half of them. Both
statements describe the same run, and only one of them makes it into a log.

I put three models through the same ten tasks on one card. The first is a 360M
included as a floor rather than a contender. The other two are the same
Llama-3-8B at two precisions, 4-bit and 8-bit.

| Model | Correct | Answered, wrong | Gave up | Completion | Accuracy |
|---|---|---|---|---|---|
| SmolLM2-360M | 0 / 10 | 0 | 10 | 0% | 0% |
| Llama-3-8B, 4-bit | 5 / 10 | 4 | 1 | 90% | 50% |
| Llama-3-8B, 8-bit | 6 / 10 | 3 | 1 | 90% | 60% |

Read the last two columns together. Completion is 90% for both 8B models.
Accuracy is 50% and 60%.

Four of the ten answers from the 4-bit model were confidently wrong. Not
refused, not errored, not flagged. Answered, in the correct format, with a
plausible number. Asked how many files were in the benchmark directory, it said
273. The directory has 6. Asked how many prompt files existed, it said 39.
There are 4.

The log line that records a successful request fired every time. So did the
dashboard, the uptime check and the retry counter. None of them can tell the
difference between `6` and `273`, because both arrive as a well-formed answer.

![Ten tasks per model. The 4-bit model is five correct, four confident wrong answers and one refusal. The 8-bit model moves exactly one cell. Both 8B models answer 9 of 10 and are right on 5 and 6.](/blog/eval-grid.svg)

### Three decisions that keep an eval honest

Most of the work is not the scoring. It is making it impossible for the test to
lie to you.

**The answer key is computed, never stored.** Every task carries a function that
works the answer out from the repository at the moment the test runs. A stored
key rots the first time a file is added. This is not hypothetical: during this
work the correct answer to one task moved from 39 to 40, because writing the
harness added a file to the directory it counts. A hardcoded 39 would have
failed a model that was right.

**The tasks come from my own repository.** Questions about files no public model
has ever seen. The alternative is contamination, a model that scores well
because the answers were in its training data, and it is unfalsifiable from the
outside. Nobody can prove what was in a training set.

**Grading is exact and mechanical.** The answer is a number or a yes, compared
to what the filesystem says. I do not let a model judge another model. That
imports the judge's failures into the score, and it cannot be audited.

Ten tasks, four tools, eight steps allowed each. Every answer is checkable by a
program.

### The ranking, and the check that broke it

The harness produces an order: the 360M floor, then 4-bit, then 8-bit. A
ranking is a claim, so I tested whether the gaps could have come from chance.

The floor is easy. 0 of 10 against 50 or 60% is not a close call at any sample
size, and that comparison is defensible.

The interesting one is 8-bit against 4-bit. Six of ten against five of ten.
`p = 1.00`. The two models disagreed on exactly one task out of ten, which is
precisely what chance produces between two equally good models. The harness
ranked them and the data does not support the ranking.

That is more useful than a clean ordering would have been. Two of my three
comparisons are solid, the one I actually cared about is not, and only the
significance check could tell me which was which.

The failure pattern makes it clearer. Both 8B models got the same four tasks
wrong: counting files in a directory, counting lines in a source file, counting
prompts, counting benchmarks. All four need a count, and both reached for a
tool that measures something else. Doubling the precision of every weight
changed the score by one task and changed the failure mode not at all. Whatever
is wrong there is not a rounding problem.

### What this instrument cannot see

The limits are worth writing down before I trust the number, because a benchmark
measures what it was built to measure and nothing else.

- **Ten tasks is too few.** The `p = 1.00` above is the proof. A one task
  difference is invisible, so only large gaps can be detected.
- **Every task is a lookup.** Count files, read a field, check existence. This
  measures tool use and instruction following. It does not measure reasoning or
  code generation.
- **One sample per task at temperature 0.** No `pass@k`, so no measure of
  whether a model that fails once would succeed given five attempts, which is
  how a coding agent is actually used. And temperature 0 is not reproducible
  under batching anyway.
- **My repository is small.** The tasks can be exhausted, and a model tuned
  against them would overfit to this one directory tree.

None of these are solved problems in the field. They are why two models can sit
a point apart on a leaderboard and feel obviously different in use, and why I
would rather trust a small, checkable, private harness than a published number.

### The only instrument that tells you it learned

Training produces a model that finished training. That is all it proves. The
loss curve says the optimiser did its job; it says nothing about whether the
result is useful. A scored test is the only thing that separates a model that
learned something from one that merely stopped.

Which is why the test gets built before the thing it measures, and why this time
I wrote down what it cannot see before I started trusting it.

If you want the other half of the picture, the [agents
post](/blog/from-answering-to-doing-agents) covers the loop, tool calling and
the guardrails that this eval is scoring. The [harness
read](/blog/reading-openclaw-harness) covers what a serious harness does with
the same loop.

### Further reading

- [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374), Chen et al., 2021. Where `pass@k` is defined, and the argument for sampling repeatedly instead of scoring one greedy attempt.
- [Data Contamination: From Memorization to Exploitation](https://arxiv.org/abs/2310.18018), Magar and Schwartz. Why a benchmark a model may have trained on measures memorisation rather than ability.
- [Analyzing the Effectiveness of Benchmarks](https://arxiv.org/abs/2405.01470), on benchmark reliability and sample size. The sample size problem this post ran into directly.
