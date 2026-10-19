---
title: My code had vulnerabilities I never wrote
date: 2025-01-06
excerpt: At Dalang I had a stack of projects and I was happy. Then I pointed OWASP ZAP and Burp Suite at one of them and the report came back full of known vulnerabilities, almost none of them mine. They came from the packages I had installed. That's the day I started paying attention to what npm install pulls in.
tags: career, security, owasp, zap, burp-suite, javascript, dependencies, cve
---

Dalang was a good stretch. I had a handful of projects running at once and I was
genuinely happy with the work. Then one of them taught me something I have never
un-learned: I ran a scanner over the app and it came back full of
vulnerabilities. Known ones. CVEs with numbers. And almost none of them were in
code I had written.

### What I actually ran

Two tools, and they are the ones to know if you are starting out like I was:

- **[OWASP ZAP](https://www.zaproxy.org/)** (Zed Attack Proxy). Free, open
  source, run by OWASP. This was my entry point because it costs nothing and the
  automated scan is right there in the UI.
- **[Burp Suite](https://portswigger.net/burp)** from PortSwigger. The Community
  edition is free, and it's the tool you see in basically every web security
  writeup.

Both work the same way at heart: they sit in the middle as a proxy, between your
browser and the app. Your traffic flows through them, so they get to see every
request and response your app sends. Once they can see the traffic, they can
report on it. ZAP and Burp both do a **passive** scan, which just watches the
traffic and flags problems without touching anything, and an **active** scan,
which deliberately throws crafted inputs at the app to see if it breaks in the
usual ways, like XSS or injection.

I started with the passive scan, because it's the safe one. You just browse your
own app with the proxy on and read what it noticed.

### The code I never wrote

That's where it got me. A big chunk of what came back wasn't about my logic at
all. ZAP has a check for vulnerable JavaScript libraries, and it lit up: the
frontend was shipping library versions with known CVEs. Burp flagged the same
kind of thing. These weren't bugs I wrote. They were in the packages I had
installed, and in the packages those packages had installed, several layers
down.

That reframed the whole report for me. I came in expecting to find my own
mistakes. Instead the scanner handed me a list of CVEs living in dependencies I
didn't even know were in the project.

### npm install is a lot more than one package

If you have ever run `npm install` and watched hundreds of packages scroll past,
that's the whole problem in one line. You pick a few libraries. Each of those
pulls in its own dependencies, and those pull in more, until you are running a tree
of hundreds of packages you never chose. Any single one of them can have a known
vulnerability, and the moment it does, it's in your app, and a scanner like ZAP
or Burp will happily point at it.

![A dependency tree: your app pulls in a few packages, each of which pulls in many more, and some of those carry a known CVE.](/blog/dependency-tree.svg)

I had been treating `npm install` like free magic. It isn't. Every package is code
you are running and trusting, usually written by someone you will never meet.

### The rest of the report

The vulnerable libraries were the part that stuck, but the scan taught me a few
other things while it was at it, and they were all cheap to fix:

- **Missing security headers.** Things like a Content Security Policy and
  `X-Content-Type-Options` weren't set. ZAP flags these on the passive scan, and
  most of them are a few lines of server config.
- **Cookies without flags.** Session cookies missing `HttpOnly` and `Secure`.
- **Information leaking in responses.** Version banners and verbose errors that
  tell an attacker more than they need.

None of that is exotic. It's the stuff the
[OWASP Top Ten](https://owasp.org/www-project-top-ten/) has been saying for
years, and the scanner just held it up in front of me for my own app.

### What I do now

I'm not a security expert, and this is beginner-level stuff. But that one scan
permanently changed how I build:

- **I run the audit.** `npm audit` is right there, and I actually read it now
  instead of scrolling past it.
- **I keep a scan in the loop.** A ZAP baseline scan over the running app catches
  the obvious things before they ship.
- **I think before adding a package.** Do I need a whole library for this, or is it
  ten lines I can write myself?
- **I prefer packages that are maintained and widely used,** and I check when they
  were last updated before I trust them.
- **I keep dependencies current,** because the fix for a CVE ships as an update you
  have to actually install.

None of that is advanced. It's just awareness, and at this stage awareness is most
of the battle.

### Why it stuck

It stuck because it changed what "my code" even means to me. My code is not just
the files I wrote. It's every line I pulled in to make those files run, and every
response my app puts on the wire. Owning the app means owning the whole tree, not
only the top of it.

That mindset is the thing I carried straight into the DevOps work that came next,
where "what exactly is running, and can I trust it" turns out to be the entire job.

### Further reading

- [OWASP ZAP](https://www.zaproxy.org/docs/)
- [Burp Suite documentation](https://portswigger.net/burp/documentation)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)
