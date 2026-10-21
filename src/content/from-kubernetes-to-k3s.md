---
title: From Kubernetes to k3s, the right amount of cluster
date: 2025-01-30
excerpt: Docker got our app into a container. The next question was who runs it across machines. I started on full Kubernetes, then moved to k3s, both self-hosted on our own bare metal. Here's what actually decided it: scale, observability, and security.
tags: devops, kubernetes, k3s, self-hosted, infrastructure, observability, containers, cloudflare
---

Docker got our app into a container. The next question was who actually runs it, across more than one machine, restarting it when it dies, moving it when a box
goes down. That's an orchestrator's job, and for us that meant Kubernetes.

I learned on the full thing and ended up on k3s running on our own hardware.
Here's how that went, the parts that hurt, and why I landed where I did.

### Why Docker alone wasn't enough

Plain Docker runs a container, but it doesn't look after it. A container that
dies stays dead unless I babysit it, dead ones pile up instead of cleaning
themselves out, and nothing stops a single app from eating all the RAM on the
box. Our apps are heavy, so a host filled up fast, and I had no automatic way to
spread them across machines or cap what each one was allowed to take.

That's the gap an orchestrator fills. Kubernetes restarts and replaces
containers when they fail, reschedules them onto a node that has room, and
enforces resource requests and limits so nothing hogs the whole machine. It
automated the exact thing I'd been doing by hand.
([the concepts](https://kubernetes.io/docs/concepts/))

### How it actually works

The idea that made it click: you don't start containers, you declare what should
be running. You hand Kubernetes a desired state, it stores that, and a set of
controllers constantly compare it against what's actually running and fix the gap.
The control plane is the brain. The worker nodes are where your pods actually run.

![How Kubernetes works: kubectl sends a desired state to the control plane, which runs pods on the worker nodes and watches them, reconciling actual state back to the desired state.](/blog/how-kubernetes-works.svg)

That reconcile loop is the whole trick. A pod dies, so the actual state no longer
matches what you asked for, so a controller starts a new one. You didn't lift a
finger. Once that clicked, the rest of Kubernetes made a lot more sense.

### Learning Kubernetes the hard way

I started with vanilla Kubernetes, standing it up myself with kubeadm. That's the
deep end, and it's a good teacher. You meet every moving part because you have to
wire it together yourself: the control plane, etcd, the container runtime, and the
networking layer that somehow never works on the first try.

The first wall was YAML. Everything in Kubernetes is a declared object, so you
write a Deployment, a Service, an Ingress, a ConfigMap, a Secret, all in YAML, and
one wrong indent quietly breaks the whole thing. Then came networking. Working out
how a request actually travels from the outside world to a pod, through a Service
and an Ingress, took me longer than I'd like to admit.

Debugging felt different too. When something breaks you don't open one log file,
you ask the cluster: `kubectl get pods`, `kubectl describe pod`, `kubectl logs`. A
pod stuck in CrashLoopBackOff, a container that got OOMKilled because I hadn't set
a memory limit, a pod stuck Pending because no node had room. Every one of those
taught me something, usually at a bad time.

Then there's the part nobody warns you about: running the control plane yourself
is its own job. etcd backups, version upgrades, certificates. On bare metal, with
a small team, that overhead adds up fast.

### Why I moved to k3s

[k3s](https://docs.k3s.io/) is Kubernetes with the weight cut out. Same API, same
objects, so `kubectl` can't tell the difference, but it ships as a single small
binary with lighter defaults. It swaps etcd for an embedded database by default
and bundles things you'd otherwise wire up by hand, like an ingress controller. It
runs fine on modest machines, which is exactly what we had.

That was the fit: our own hardware, a cluster we fully control, and far less of the
control-plane babysitting that had been eating my time on full Kubernetes.

### Getting traffic in without a public IP

Our boxes didn't have public IPs. So instead of exposing anything, we put a
Cloudflare Tunnel in front: `cloudflared` runs inside the cluster and makes an
*outbound* connection to Cloudflare, and traffic comes back down that tunnel.
Nothing listening on a public port, and no load balancer to pay for.

![Architecture: traffic enters through Cloudflare and an outbound tunnel into a k3s cluster running on bare-metal VMs with no public IP.](/blog/k3s-architecture.svg)

([Cloudflare Tunnel docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/))

### The honest pros and cons

If you're weighing this up, here's what I'd tell you.

What you gain:

- **Self-healing.** Containers that die get restarted or replaced without you
  touching anything.
- **Resource limits.** You set how much CPU and memory each app can use, so one
  hungry app can't take down the whole box. This was the fix for my RAM problem.
- **Declarative everything.** You describe the state you want and the cluster works
  to match it, which also means your whole setup lives in files you can review and
  version.
- **Rolling updates and rollbacks.** Ship a new version gradually, and step back if
  it misbehaves.
- **It scales sideways.** Need more capacity? Add a node.
- **Portability.** The same manifests run on full Kubernetes and on k3s, so what
  you learn carries over.

What it costs you:

- **A real learning curve.** Pods, Services, Ingress, RBAC, volumes. It's a lot to
  hold in your head before anything feels productive.
- **YAML everywhere**, and it's unforgiving about indentation.
- **Networking is confusing at first.** How traffic actually reaches a pod isn't
  obvious until it clicks.
- **Debugging is more indirect.** You inspect the cluster instead of tailing one log
  file.
- **The control plane isn't free.** It uses resources and, on vanilla k8s, needs
  looking after. That's exactly why I ended up on k3s.
- **It's overkill for small things.** For one container on one box, plain Docker is
  still fine.

### What actually decided it: scale, observability, security

Three things, really.

**Scale.** We didn't need a highly-available, multi-master control plane for our
traffic. k3s handles what we run, and when we need more we add a node. Full k8s
HA was solving a problem we didn't have yet.

**Observability.** This was the one I cared most about getting right. Prometheus
scrapes the metrics, Grafana turns them into dashboards I actually look at, and
that same setup runs on k3s exactly like it does on full Kubernetes. So I gave up
nothing here. Being able to see what the cluster is doing was non-negotiable.

**Security.** The Cloudflare Tunnel already means nothing is exposed inbound,
which is most of the battle. On top of that Kubernetes gives you
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), namespaces,
and secrets to keep things scoped, and k3s ships with sensible locked-down
defaults instead of making you harden everything from zero.

### What I'd use, and when

If you own the hardware, or you're at a small-to-mid scale, k3s gives you real
Kubernetes without the weight. If you genuinely need large-scale HA, full
Kubernetes is worth the extra operating cost. The nice part is it's the same API
either way. What I learned standing up full Kubernetes carried straight over to
k3s, so none of that time was wasted.

### Why this felt like a step up

The jump wasn't learning more YAML. It was realizing "the right tool" depends on
your constraints, not on what's trending, and then being the one who makes that
call and owns it. That mindset, more than any single command, is what moved me
toward mid-level.

### Further reading

- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [k3s docs](https://docs.k3s.io/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Kubernetes RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [Workloads: Deployments & Pods](https://kubernetes.io/docs/concepts/workloads/)
