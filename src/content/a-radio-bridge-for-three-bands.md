---
title: Making three radios talk across three bands
date: 2025-03-06
excerpt: Still in 2025, away from the servers for a bit. The problem was simple to say and annoying to live with: an HF manpack, a VHF walkie, and a UHF handheld, and none of them could hear the others. So I built a little middleware out of a Raspberry Pi, a couple of USB sound cards, and a drawer of passives.
tags: hardware, radio, raspberry-pi, electronics, rf, python, interoperability, field-comms
---

Still 2025, but this one has nothing to do with Docker. For a stretch I was away
from the servers and deep in a pile of radios, and I built a piece of hardware I'm
still a little proud of.

The problem was easy to say. You've got three radios in play: an HF manpack (a
Harris, the big box one), a VHF walkie, and a UHF handheld. Three people, three
radios, and none of them can hear the other two.

### Why they can't just hear each other

Because they're on completely different bands, and a band is a frequency range.
HF, VHF, and UHF aren't settings on a dial, they're different parts of the
spectrum with different wavelengths, different antennas, and different ways the
signal travels. A UHF handheld and an HF manpack are about as likely to hear each
other as two people shouting in different rooms with the doors shut. The radios
are all working fine. They're just not on the same page, and no knob fixes that.

![HF, VHF, and UHF drawn as sine waves of the same width: HF is a long, slow wave (roughly 10 to 100 metres), VHF is shorter (about 2 metres), and UHF is short and dense (about 70 centimetres). Lower the band, the longer the wave.](/blog/band-wavelengths.svg)

The wavelengths tell the story. HF stretches out to tens of metres, VHF is down
around two, and UHF is a matter of centimetres. Three completely different lengths,
and nothing on the radio lets one reach across to another.

The usual answer is an expensive box that does exactly this, or you re-equip
everyone onto one system. I didn't want to do either. I wanted the cheap, scrappy
version.

### The idea: don't touch the RF, bridge the audio

Here's the thing that unlocked it for me. I don't have to translate radio waves. I
just have to move the *voice*. Every one of these radios has an audio socket, the
accessory port you'd normally plug a headset or a handset into. That socket gives
me the received audio coming out, and a way to feed audio back in, plus a line to
key the transmitter.

So the plan became: wire each radio's socket into a Raspberry Pi, let the Pi
listen to whoever is talking, and have it replay that voice into the other two
radios and press their transmit button for them. The Pi never transmits anything
itself. It's pure middleware. Each real radio keeps doing its own RF on its own
band, and the Pi just shuttles the conversation between them.

![The signal chain: three radios (HF, VHF, UHF) feed an interface board that trims and isolates the analog audio and automates PTT with a transistor, then through a USB sound card into a Raspberry Pi running the bridge logic.](/blog/radio-bridge.svg)

### The build, stage by stage

The whole thing is a short signal chain, top to bottom: the radios, an interface
board, a USB sound card, and the Pi.

**The radios.** Three of them, each tapped at its accessory socket for three
things: the received audio coming out, a mic line to feed audio back in, and a PTT
line to key the transmitter.

**The interface board.** This is the part that matters most, and the part I learned
the hard way. The radios and the Pi do not agree on anything electrically. The
levels are different, the grounds are different, and a radio can put far more
voltage on a line than a Pi input ever wants to see. So between them sits a small
board built from resistors and capacitors that trims the audio down to a safe level
and blocks the DC, with isolation so a radio can't short straight through into the
Pi. That last part is not theoretical. Shorts happen, more often than you'd think,
and without this board a bad moment on a radio turns into a dead Raspberry Pi. The
PTT keying lives on this board too: a BJT per radio, driven by a GPIO pin, pulls
each radio's push-to-talk line to ground on command. GPIO goes high, the transistor
keys the radio. That's the automated PTT, and it stays on the protected side of the
board, away from the Pi.

**The USB audio.** A USB sound card (a channel per radio) carries the conditioned
audio in and out between the board and the Pi. Going through USB audio instead of
wiring analog straight into the Pi keeps all the messy analog on the board side and
hands the Pi clean digital samples.

**The Raspberry Pi.** The brain. It samples whoever is talking, decides who needs
to hear it, replays the voice, and tells the board when to key the other radios.

That's really it. A Pi, a USB sound card, and a little interface board of resistors,
caps, and transistors standing guard between the radios and the computer.

### Can a Pi even hear it? The math says yes

A radio's audio is just a sound wave, a continuous signal $x(t)$. To get it into
the Pi I have to sample it: measure its amplitude a fixed number of times every
second. Sample $f_s$ times a second and the wave turns into a list of numbers,

$$x[n] = x(n T_s), \qquad T_s = \frac{1}{f_s}$$

The real question is whether that list captures the wave or throws half of it
away. The [Nyquist–Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem)
answers it: you can reconstruct a signal exactly as long as you sample faster than
twice its highest frequency,

$$f_s > 2 f_{\max}$$

Voice sits in roughly the 300 to 3400 Hz range, so even $f_s = 8\,\text{kHz}$ is
enough to carry it (that's why old phone lines sound the way they do). A one-dollar
USB sound card runs at 44.1 or 48 kHz, miles more headroom than speech needs. So
yes, the wave gets caught, and cleanly.

On the Pi, the sound card hands me exactly that array of samples. The
[`sounddevice`](https://python-sounddevice.readthedocs.io/) package, a wrapper over
PortAudio, reads frames and `numpy` holds them:

```python
import sounddevice as sd
import numpy as np

fs = 48000                                 # samples per second
frame = sd.rec(int(0.02 * fs),             # grab 20 ms of audio
               samplerate=fs, channels=1)
sd.wait()
samples = frame[:, 0]                      # x[n]: amplitudes as a numpy array
```

That `samples` array *is* the captured wave, now just numbers I can measure.

### Turning samples into "someone is talking"

Detecting speech is the next bit of math, and it's friendlier than it looks. I
take a short frame and compute its energy, the root-mean-square of the samples,

$$\text{RMS} = \sqrt{\frac{1}{N} \sum_{n=0}^{N-1} x[n]^2}$$

Silence sits near zero, a voice pushes it up. Cross a threshold and the bridge
decides someone is talking and keys the other radios:

```python
rms = np.sqrt(np.mean(samples ** 2))
talking = rms > THRESHOLD        # THRESHOLD tuned to the noise floor
```

That's the whole trigger. One line of numpy standing in for a hardware VOX
circuit.

### Making the relay behave

Writing "the Pi replays the audio" in one sentence hides where all the actual work
is. The fiddly parts, in the order they bit me:

- **Tuning that threshold.** The RMS trigger above sounds tidy until you set the
  number. Too sensitive and it keys up on static and background hiss, too high and
  it clips the first word of every sentence.
- **Not creating a feedback loop.** The moment the Pi transmits what it heard, that
  audio can come back around and retrigger the whole thing. You have to make sure a
  radio that's currently transmitting isn't also being treated as "someone talking."
- **Timing and half-duplex.** These radios can't listen while they transmit. So the
  bridge is juggling who's allowed to talk when, and a bit of latency sneaks in
  while it keys up the other sets. You learn to leave a beat before you speak.
- **Levels and grounding.** Too hot and the audio distorts into mush, too quiet and
  the far radio won't open its squelch. Ground loops add a lovely hum on top. This
  is where most of my evenings went, honestly.
- **Every socket is different.** The Harris, the walkie, and the handheld all have
  their own pinout for audio and PTT, so each connection was its own little puzzle.

None of it is magic. It's just patience, a multimeter, and getting the levels
right one radio at a time.

### The honest part: this is the transmit side

I'll be straight about this the same way I am about everything else here.
Everything downstream of the bridge is real radios keying up and putting signal on
the air across HF, VHF, and UHF. That is the regulated, grown-up end of the hobby.
Bands are allocated, and some of the gear here lives on frequencies you very much
do not get to play on casually. So the sane way to build and test this is into a
dummy load or a shielded setup, on frequencies and with authorization you're
actually allowed to use. The clever bit is the bridge logic. The RF is somebody's
licensed responsibility, and I kept it that way.

### Why it stuck

This one scratched a different itch than the DevOps work. That was all software
owning the thing that runs in production. This was software reaching back into the
physical world: a line of code deciding when a transistor pulls a wire to ground
so a radio three feet away keys up. The whole problem looked like a radio problem
and turned out to be a tiny bit of electronics plus a loop of code.

That's the part I keep coming back to. Half of this job is realizing the scary,
specialized problem in front of you is actually a few small, boring problems you
already know how to solve, wired together.

### Further reading

- [SvxLink](https://www.svxlink.org/), the open-source voice-linking project that does this kind of thing properly
- [python-sounddevice](https://python-sounddevice.readthedocs.io/), the package that reads the audio on the Pi
- [Nyquist–Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem), why the sampling actually works
- [Crossband operation](https://en.wikipedia.org/wiki/Crossband_operation), the general idea of relaying between bands
- [Radio over IP](https://en.wikipedia.org/wiki/Radio_over_IP), where this leads once the bridge goes over a network
- [ALSA](https://www.alsa-project.org/wiki/Main_Page), the Linux audio layer the USB sound cards talk to
