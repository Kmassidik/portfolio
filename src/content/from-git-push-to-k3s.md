---
title: From git push to running in k3s
date: 2025-07-08
excerpt: The app was containerized and running on k3s, but I was still the deploy script. CI/CD with GitHub Actions and a GitOps setup took me out of that loop. A push ships it, and git is the source of truth.
tags: devops, gitops
---

By now the app was containerized and running on k3s. Great. One small problem: I
was the deploy pipeline. Pull, build the image, push, bump the tag, kubectl this,
kubectl that, then sit there praying I hadn't fat-fingered a step. Every release
was me and a terminal at some cursed hour of the night.

At some point you get tired of being a human CI runner. That's when CI/CD stopped
being a buzzword to me and became the thing that gave me my evenings back.

### What CI/CD actually is

It's two halves. CI, continuous integration, is the part that runs on every push:
build the code, run the tests, and if you ship containers, build the image. CD,
continuous delivery, is getting that build out to where it runs. Strung together,
a push to git ends with new code running and no manual steps in between.

### My pipeline (GitHub Actions)

The code lives on GitHub, so the pipeline is a workflow under
`.github/workflows/`, run by GitHub Actions. Stripped down, it looks like this:

```yaml
name: ci

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
```

The image goes to the GitHub Container Registry (`ghcr.io`), tagged with the
commit SHA. `github.repository` and `github.sha` are values GitHub hands the
workflow, and `GITHUB_TOKEN` is injected automatically so the push can
authenticate. ([GitHub Actions docs](https://docs.github.com/en/actions),
[container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry))

### Deploying the GitOps way (Argo CD)

Here's the part I like. The pipeline never runs commands against the cluster. Its
last job just writes the new image tag into a git repo that holds our Kubernetes
manifests. That's the whole deploy. It's a git commit.

[Argo CD](https://argo-cd.readthedocs.io/) watches that repo. When the manifest
changes, it sees the cluster no longer matches git and syncs it: pulls the new
image and rolls out the update. Git is the single source of truth for what should
be running, and Argo keeps the cluster lined up with it.

![CI/CD pipeline: a git push triggers GitHub Actions to build, test, and push an image, then write the new tag to git, and Argo CD syncs the k3s cluster to match git.](/blog/cicd-pipeline.svg)

If that sounds familiar, it's the same reconcile loop from
[how Kubernetes works](/blog/from-kubernetes-to-k3s), pushed one level out. Git is
the desired state, and Argo is the controller keeping reality matching it.
([GitOps principles](https://opengitops.dev/))

### The honest pros and cons

What you gain:

- **No more manual deploys.** A push ships it. I stopped being a step in the
  process.
- **It's consistent.** The pipeline does the same thing every time, so there's no
  "worked when I did it by hand."
- **Every deploy is a git commit.** You can see exactly what changed, and roll
  back by reverting.
- **Fast feedback.** Tests run on every push, so breakage shows up early instead
  of at deploy time.
- **Drift is visible.** Argo tells you when the cluster has drifted from git.

What it costs you:

- **More to run.** GitHub Actions and the registry live on GitHub, but Argo is one
  more service to run and watch on your own cluster.
- **Pipeline debugging is its own skill.** A red pipeline at the wrong time is a
  fresh kind of pain.
- **Secrets get real.** CI needs registry credentials, Argo needs access to the
  cluster, and all of it has to be stored safely.
- **You lean on GitHub.** CI and the image registry live there, so a GitHub outage
  or a minutes limit lands right in your deploy path.
- **More moving parts** to reason about when something doesn't deploy.

### Why this felt like a step up

The shift was giving up control to get reliability. Early on, deploying by hand
felt safer because I could watch every step. It wasn't safer. It was just me being
a single point of failure. Letting the pipeline own the boring, repeatable parts,
and trusting git as the source of truth, is what actually made releases calm.

### Further reading

- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Argo CD](https://argo-cd.readthedocs.io/)
- [GitOps principles](https://opengitops.dev/)
