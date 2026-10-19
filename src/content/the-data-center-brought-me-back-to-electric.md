---
title: The data center brought me back to electric
date: 2024-09-10
excerpt: After the WordPress chapter the job drifted into web and mobile apps, which I barely remember. Then I got put near the data center. This is most of what I learned in that room, the real machinery under the word "cloud": servers, cabling, cooling, power, connectivity, fire safety, and tiers.
tags: career, data-center, infrastructure, hardware, servers, networking, cabling, electrical
---

After the WordPress chapter, the job drifted into standard Android work for a
while, a teacher and tutoring manager, a logistics tracker, a cashier app, all
solid CRUD and all forgettable. Then I got put near the data center, and that is
the part I actually remember.

The first time I stood in front of a rack, my honest reaction was "oh, so *this*
is a server." I had been deploying to servers for over a year without ever
touching one. Suddenly there it was. Metal, loud, hot at the back, cold at the
front, blinking.

What follows is most of what I learned in that room. The actual machinery that
hides under the word "cloud."

### Servers and the rack

A server is not a vibe that lives in the cloud. It's a box bolted into a rack. I
learned to think in rack units: 1U is one slot, about an inch and three quarters
tall, 2U is two of them. A thin pizza-box server is 1U, a chunkier one with more
drives is 2U. A full rack is usually 42U, and you fill it from the top-of-rack
switch down.

And it was not all servers. The same rack held storage boxes (NAS), a mix of
switches and routers, some older Sun machines still earning their keep, and a
pull-out monitor and keyboard (a KVM) to actually work on any of it.

![One server rack holding a switch, 1U and 2U servers, a NAS, and a KVM, fed by power, cooling, and network.](/blog/data-center-rack.svg)

That reframed everything. The "cloud" I had been pushing code to was always a room
like this one. Owned by someone, bolted down, and blinking.

### What surprised me

A few things hit me walking in:

- **How loud it is.** A rack full of fans is not quiet. You raise your voice next
  to it.
- **How cold the front is.** Cold air is pushed into the front of the servers, so
  standing there your hands go numb after a while.
- **How little of it is the servers.** The compute was almost the easy part.
  Everything around it, the power, cooling, cabling, and fire safety, was the real
  system.

### The cabling

Behind every tidy rack is a pile of cables that somebody has to keep from becoming
a disaster. There is a whole discipline here called structured cabling. Copper for
the short runs (Cat5e, Cat6, Cat6a, where the category depends on the speed and
distance you need), and fiber for the long or fast runs (single-mode for distance,
multi-mode for shorter hops).

The cables land in switches and routers, which is where a pile of wires becomes a
network. We used MikroTik for a lot of it, so I ended up in RouterOS learning
VLANs, routing, and firewall rules.

The part nobody tells you is how much of the job is tidiness. Patch panels so a
change is a short jumper instead of a re-run across the room. Cable trays and
managers, overhead or under a raised floor. Velcro, not zip ties, so you can
change one cable without cutting ten. Labels on both ends. A bend radius on fiber
you do not violate. I got certified in this, which felt good. It was the first
thing in my new career where the answer was physical and exact, not "it depends on
the framework."

### How the room stays cold

Servers turn electricity into heat, a lot of it, and heat kills silicon. So a huge
part of a data center is just moving that heat somewhere else.

The room is cooled by CRAC or CRAH units, basically industrial air conditioners
and air handlers, usually fed by chillers and cooling towers outside. In many
rooms the cold air is pushed into a raised floor and rises through perforated tiles
in front of the racks. Servers pull that cold air in the front and blow hot air out
the back, so you arrange the racks into cold aisles (fronts facing) and hot aisles
(backs facing), and often physically contain one so the hot and cold never mix.

![A CRAC unit pushes cold air into the front of a rack, hot air leaves the back and returns to be cooled again.](/blog/data-center-cooling.svg)

Standing at the cold front of a rack is a specific feeling. Freezing air, a wall of
fan noise, rows of little lights blinking in the dark. The first time, it honestly
felt like standing inside the thing I had only ever seen as a URL.

### The power chain

The other half is power, and it is built around one question: what happens when
the grid goes out? The answer is a chain of backups.

Utility power comes in, often on more than one feed. If it fails, an automatic
transfer switch (ATS) flips over. A UPS, batteries or a flywheel, carries the load
for the few seconds it takes the diesel generators to start, with fuel on site for
a long outage. From there, power distribution units (PDUs) fan it out to the racks,
and each rack usually gets two feeds, an A side and a B side, so a server with two
power supplies keeps running even if one whole path dies.

![The power chain: utility feed into a transfer switch, then a UPS, then a PDU, then the rack, with a diesel generator as backup.](/blog/data-center-power.svg)

Coming from software, where "it crashed, restart it" is often fine, this was a
different religion. Here, staying up is the entire job, and you design backwards
from never going down.

### Getting the internet in

A data center is useless if traffic can't reach it, so connectivity is its own
system. Good facilities are carrier-neutral: several internet providers come in,
ideally through physically separate entry points so one backhoe can't cut all of
them at once. The carriers meet and cross-connect in a meet-me room. Routing runs
over BGP, so if one provider drops, traffic fails over to another without anyone
noticing. The goal, like everything else here, is to have no single thing whose
failure takes you offline.

### How many racks fit in a room

You would think a room's limit is floor space. It usually isn't. The real limits
are power and cooling. A rack might draw anywhere from a couple of kilowatts to
twenty or more, and every one of those watts turns into heat the cooling has to
remove. So a room is rated by how much power and cooling it can deliver, per rack
and in total, and that, not the floor, decides how many racks you can actually run.
Pack them too densely and you create a hot spot nothing can cool. Capacity planning
in a data center is really a power and heat budget.

### Fire, without water

Here is one that surprised me: you cannot just hang sprinklers over a room full of
running electronics, because water finishes what the fire started. So data centers
detect fire absurdly early and put it out without water.

Detection is often VESDA, Very Early Smoke Detection Apparatus, which constantly
samples the air through a network of pipes and can smell smoke long before anything
is visible. Suppression is usually a clean agent, a gas like FM-200 or Novec 1230,
or an inert gas mix, that floods the room and stops combustion without soaking the
equipment. The whole idea is to catch a problem while it is still a whiff, not a
flame.

### Tiers: how much uptime you're paying for

All of this redundancy gets summed up in a rating called tiers, Tier I through Tier
IV. Once I understood it, all the paranoia around power and cooling made sense. A
tier is basically a promise about how little downtime you will ever see, and you
buy it with redundancy.

![The four data center tiers as rising bars, each adding redundancy and uptime, from Tier I at about 99.67% to Tier IV at about 99.995%.](/blog/data-center-tiers.svg)

- **Tier I** is the basics. One path for power, one for cooling, no backup for the
  parts in between. It runs, right up until anything fails or needs maintenance.
  Around 99.67% uptime, which is close to a full day offline a year.
- **Tier II** adds redundant components. Still a single path, but spares in line, an
  extra UPS, an extra generator. A little over 99.74%.
- **Tier III** is concurrently maintainable. Multiple independent paths, so any
  single component can be pulled offline and serviced while the site keeps running.
  No 2am shutdown to swap a part. Around 99.98%.
- **Tier IV** is fault tolerant. Everything is doubled, so any single failure, a
  dead component or an entire failed path, is absorbed with no impact at all.
  Around 99.995%, which is roughly 26 minutes of downtime a year.

The jump from Tier I to Tier IV is not about faster servers. It is about how many
ways you have built to survive something breaking. Each step up is another layer of
redundancy and another nine on the end of that uptime number.

### Back to electric

If you read the first post here, I left electrical engineering for software because
I wanted to build the whole system. The joke is that the data center handed
electrical right back to me, and I was happy to take it. Circuits, loads, transfer
switches, cooling, the physics of moving heat and current around a room. Standing
in that cold room reading a circuit and tracing a cable, I was the most useful
version of myself I had been all year, precisely because of the career I thought I
had left.

### What it taught me

I walked out of that room with a kind of respect most software people never get to
build. Every app I deploy now runs on a box like the ones I stood in front of, in a
room someone keeps cold, powered, connected, and watched for smoke. The cloud is
not magic. It's infrastructure, infrastructure is physical, and someone is always
on the hook for the heat and the electricity.

That, and I stopped being embarrassed about the electrical engineering past. It
turned out to be the most useful thing I brought with me.
