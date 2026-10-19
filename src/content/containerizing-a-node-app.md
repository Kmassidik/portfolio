---
title: Containerizing our deploys with Docker
date: 2025-03-20
excerpt: We used to deploy by pulling code onto a server by hand. Moving the app into a Docker container fixed most of that, but my first image was almost a gig. These are the few changes that made it small and boring to ship.
tags: devops, docker
---

For a while our deploys were pretty manual. SSH into the box, pull the latest
code, restart the process, and hope nothing on the server was different from my
laptop. It mostly worked. Then we moved the app into a Docker container and a lot
of that just went away.

My first Dockerfile wasn't good though. The image was close to a gig, it rebuilt
slowly, and it ran as root. It took me a while to work out why, so here's the
version I use now and what each change is actually doing.

### My first Dockerfile

This is roughly where I started. If you've touched Docker before it probably
looks familiar:

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

It runs, which is kind of the trap. The problems only show up later:

- The base image on its own is about a gig, before any of my code.
- It ships the whole build toolchain. Dev deps, compilers, caches: the running
  app needs none of it.
- `COPY . .` grabs everything, including `node_modules` and `.git`.
- Every little code change re-runs the install.
- It's running as root.

The [Dockerfile best practices](https://docs.docker.com/build/building/best-practices/)
page covers most of this. The one that fixes the rest is multi-stage builds.

### Multi-stage builds

The idea is to build in one image that has all the heavy tooling, then copy only
the result into a second, clean image. The build image gets thrown away.

![Multi-stage Docker build: stage one uses the full toolchain to build the app and is discarded; only the built output is copied into a small stage-two runtime image that ships.](/blog/docker-multistage.svg)

Docker's [multi-stage docs](https://docs.docker.com/build/building/multi-stage/)
go deeper, but honestly the picture is the whole idea.

### The Dockerfile I use now

```dockerfile
# syntax=docker/dockerfile:1

# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy only the manifests first so this layer stays cached until deps change.
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Production deps only.
COPY package*.json ./
RUN npm ci --omit=dev

# Bring over just the built output.
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

A few things are doing most of the work:

- `npm ci` instead of `npm install`. It installs straight from the lockfile, so
  it's reproducible and faster in CI.
  ([docs](https://docs.docker.com/build/building/best-practices/#leverage-build-cache))
- Copying `package*.json` before the rest of the code. Docker caches layers top
  to bottom, so putting the manifests first means `npm ci` only re-runs when deps
  change, not every time I edit a file.
  ([build cache](https://docs.docker.com/build/cache/))
- `--omit=dev` in the final stage. No test runners or bundlers in the thing I
  actually deploy.
- `USER node`. The official images already ship a non-root `node` user, so I use
  it. ([Node image best practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md))

If you're serving a static build instead of a Node server, it's the same shape.
The second stage is just an `nginx:alpine` hosting the files.

### Don't skip the .dockerignore

This one's easy to skip and really shouldn't be. `COPY . .` hands your whole
folder to Docker as the build context. Without a `.dockerignore`, that includes
`node_modules` and `.git`, which is slow to send and an easy way to leak something you
didn't mean to.

```
node_modules
.git
dist
.env
*.log
Dockerfile
```

Adding this dropped my build context from a few hundred MB to almost nothing.
([how context works](https://docs.docker.com/build/concepts/context/#dockerignore-files))

### What changed

| | Before | After |
| --- | --- | --- |
| Image size | ~1.1 GB | ~180 MB |
| Rebuild on a code change | re-installs deps | cached, seconds |
| Runs as | `root` | non-root `node` |
| Ships dev deps | yes | no |

### Why this felt like a step up

The size was the fun part to brag about, but the thing that stuck with me was
starting to treat *what builds the app* and *what runs the app* as two different
things. Once you see it that way you start caring about what ends up in the final
image, about the lockfile, about caching, because now it's your own build time
on the line.

That's the part that felt like leveling up. Less "I can write the code," more "I
own the thing that goes to production."

### Further reading

- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Dockerfile best practices](https://docs.docker.com/build/building/best-practices/)
- [Build cache](https://docs.docker.com/build/cache/)
- [`.dockerignore` and build context](https://docs.docker.com/build/concepts/context/#dockerignore-files)
- [Node.js Docker best practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Distroless images](https://github.com/GoogleContainerTools/distroless) for going even smaller
