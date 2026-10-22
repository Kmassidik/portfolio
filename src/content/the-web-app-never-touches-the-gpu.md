---
title: The web app never touches the GPU
date: 2026-10-12
excerpt: The image service is eight Python files and 862 lines built on one rule, the API writes a job row and a separate worker beside the card claims one at a time. The queue, the JSON catalog that adds a model without code, the swap cycle that keeps four models on one 8 GB card, and the isolation that keeps it off the audio card.
tags: ai, architecture, self-hosted, python, gpu, fastapi
---

The most useful decision in the image service is a boundary, not a framework.

The FastAPI process serves the page, takes a prompt, writes a row into SQLite,
and returns a job id. It never imports torch, never opens a CUDA device, and
never holds a model. A separate systemd unit beside the cards runs a worker that
claims one row at a time, renders it, and writes the path back.

That is the whole architecture. Everything else follows from it.

![Browser to FastAPI to SQLite, then a separate worker that claims one job at a time and renders on GPU 1. GPU 0 for audio and GPU 2 for the language model are not visible to the worker.](/blog/image-queue.svg)

### Why one at a time is deliberate

The obvious objection is that a queue of one wastes the card. It does not, on
this box.

A second render does not share an 8 GB card with the first. It competes for the
same allocator and the same headroom, and the usual result is that both jobs
slow down and one of them dies. The decode peak from the [last
post](/blog/the-crash-happened-at-the-last-step) is the reason: you do not want
two processes discovering the ceiling at the same moment.

So `claim()` returns nothing if anything is already running:

```python
if conn.execute("SELECT 1 FROM jobs WHERE status=?", (RUNNING,)).fetchone():
    return None
```

The update is guarded too, with `AND status='queued'`, so a row cannot be
claimed twice by accident.

### The queue is one table

SQLite in WAL mode, with a 30 second busy timeout. The schema is a single `jobs`
table: id, model, status, params as JSON, seed, image path, error, seconds, and
three timestamps.

That is enough for the whole product:

- the gallery is the `done` rows that have an image
- the queue depth is a count of `queued` and `running`
- the position shown to a waiting client is its index in the queued order
- cancelling only deletes a row that has not started
- a failed job stores the error, truncated to 400 characters

There is no Redis, no Celery, no broker. At one worker, a handful of users and
minutes per job, a file with a write-ahead log is the correct amount of
machinery.

### The catalog adds a model without code

Each model is one JSON file. No Python per model, no branch per family in the
request path.

```json
{
  "id": "sd35-medium",
  "engine": "diffusers",
  "family": "sd3",
  "defaults": { "width": 1024, "height": 1024, "steps": 30, "cfg": 4.5 },
  "limits": { "min_side": 256, "max_side": 1536, "max_steps": 60 },
  "device": 1
}
```

The loader validates the required keys on startup, rejects an unknown engine,
and fills in `enabled` and `device` if they are missing. The page never learns a
model name. It asks for a picture, and the catalog decides the command and the
defaults.

`clamp()` applies the limits before anything is queued. Sides are rounded down
to a multiple of 16, because the latent grid needs it. Steps are capped. A
request cannot ask for a size the card cannot survive.

Adding a model is dropping in a JSON file and the weights. Changing a default is
editing JSON. Neither touches the request handler.

### Two engines behind one endpoint

The catalog allows two engines, and the difference is where the work happens.

**`sdcpp`** builds an argument vector for `stable-diffusion.cpp` and runs it as a
subprocess. Paths and parameters are filled into the declared argument list, and
a dict that returns `{key}` for anything missing keeps a typo visible instead of
silently blank. The subprocess gets `CUDA_VISIBLE_DEVICES` from the catalog.

**`diffusers`** loads a pipeline in process, with a loader per family. Four
families are wired: Qwen 2.1, FLUX, SDXL and SD3. Each loader returns the
pipeline and a render function, so the worker's job is the same regardless of
which one is on the card.

The deployed worker is the diffusers one. The sd.cpp entry is still in the
catalog, disabled, because it is the path for GGUF weights and it is not dead
code. It is just not the path this box uses today.

### Four models, one card, a swap cycle

The worker keeps one pipeline in memory. When a job names a different model, it
does this:

```python
_cur["pipe"] = None
_cur["render"] = None
_cur["id"] = None
_free()          # gc.collect() + torch.cuda.empty_cache()
pipe, render = LOADERS[family](spec)
```

Unload, collect, empty the cache, load the next one. There is no world in which
a 12B FLUX and a 7B Qwen sit on 8 GB together, so the swap is not an
optimisation. It is the only way the picker can exist.

The loaders call `enable_sequential_cpu_offload()`, and the worker tiles the VAE
after every load. The load cost is real: 3 seconds for bf16 through mmap, 36
seconds for int8 because it quantises on the way in. That is paid on a model
change, not on every image, which is why the resident design is worth it.

### The isolation is configuration, not discipline

The worker's unit sets `CUDA_VISIBLE_DEVICES=1`. The process cannot see GPU 0 or
GPU 2, so it cannot touch the audio service or the language model even if a path
is wrong.

The app unit deliberately sets no CUDA variable at all, because the app never
runs a GPU job.

The worker also has its own virtual environment. The video engine's Python is
never modified by an image render. The Qwen pipeline lives in `.venv-qwen21`,
and the unit points at it directly.

Three more lines matter on a box that reboots:

- `Restart=on-failure`, so a dead worker comes back.
- `KillMode=mixed` with `TimeoutStopSec=600`, so a restart lets the render in
  hand finish.
- `reset_stale()` on startup, so a job that was running when the worker died is
  marked failed instead of staying running forever.

Generation is gated. With `OWNER_PASSWORD` set, the request needs it. With it
empty, creation is allowed from private, loopback and Tailscale addresses only,
so an unconfigured box is never open to the internet. Viewing the gallery is
open either way.

### What this does not do

- **It knows a job finished, not that the image is good.** There is no quality
  score in the database, for the same reason the [eval
  post](/blog/the-eval-says-it-was-wrong) exists. A successful render and a good
  render are different claims, and this system only makes the first one.
- **One worker is a single point of failure.** The queue survives a restart, and
  the interrupted job is marked failed, but nothing else picks it up.
- **SQLite is right for this scale and wrong for the next one.** One writer, one
  worker, minutes per job. It is not a distributed queue.
- **`claim()` is not a lock across machines.** It relies on exactly one worker
  process. A second worker would need a stronger claim than a select followed by
  an update.
- **The queue is FIFO.** A ten minute Qwen render blocks a hundred second SD3.5
  draft behind it. Priorities are a feature I have not needed yet.
- **The error field is 400 characters.** Enough for the message, not for the
  traceback. The traceback goes to the journal.
- **The gallery has no authentication.** Anyone with the URL can view every
  image.

### The part worth copying

Not the stack. The boundary.

The web process writes a row. The worker owns the card. The card is visible to
exactly one process. Every other choice, FastAPI, SQLite, diffusers, systemd,
could be replaced without moving that line.

### Further reading

- [SQLite write-ahead logging](https://sqlite.org/wal.html), the reason a single file can carry a queue this small.
- [FastAPI](https://fastapi.tiangolo.com/), the request layer that never imports torch.
- [Diffusers memory optimization](https://huggingface.co/docs/diffusers/optimization/memory), for the offload and tiling the swap cycle depends on.
- [systemd.kill](https://www.freedesktop.org/software/systemd/man/latest/systemd.kill.html), including `KillMode=mixed` and what it does to a render in progress.
