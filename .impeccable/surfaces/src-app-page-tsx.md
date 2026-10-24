---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Home surface

Mode: Experience. The work leads; the interface is the work.

## Job

A hiring manager arrives from a link with under a minute on a laptop. The surface must make "AI software engineer, design-engineering first" legible in one viewport and provable in three. Secondary audiences: freelance clients, peers, admissions committees.

## Proof

There is no industry track record, so the site argues from a running system rather than from credentials. Every claim resolves to a measurement or an executing artefact. Hard rule: nothing appears on screen that is not measured.

## Chosen direction

Runtime. The portfolio as a running system, not a picture of one. Sequence: the page's own pulse, then name plus live telemetry, then a real event log, then project layers that execute in place, then a probe that names whatever it points at. Memorable moment: the pulse at first paint, then the probe.

## Constraints

Next.js 16.4.2 App Router, React 19.3, Tailwind v4, TypeScript, pnpm. No image generation, so the build is code-led. The instrumentation must not break its own budget: LCP under 1.5s, CLS under 0.02, no long task over 50ms. Designed no-JS and reduced-motion states. Do not invent: the handle, logo, GitHub URL, contact address, domain, or the project list.

## Unresolved decisions

The project list and which projects can run as live modules; the contact channel; whether the probe ships to every visitor or is opt-in.

## Direction contract

THESIS: The portfolio is a running system, not a picture of one. It refuses both the hero-plus-cards portfolio and the metaphor portfolio — no catalogue, no atlas, no instrument costume.

OWN-WORLD: Near-black ground with paper-white for documents, one signal colour reserved exclusively for live data, 1px hairline rules, tabular numerals in a mono, a contemporary grotesque at tight tracking. No gradients, no glass, no rounded cards.

STORY: The visitor watches the page measure itself, reads a real event log, operates a project module, and probes any element to learn what it is and what it costs. They leave believing this person builds systems with rigour, because the page behaved like one.

FIRST VIEWPORT: A full-bleed pulse trace at mid-height, drawn live from frame deltas. The name sits large at left on the baseline grid. A narrow telemetry column at right carries frame, memory, paint and network, with the event log beneath it. The primary action is a single hairline-bordered Correspondence link at the lower left.

FORM: Pinned by the user after three rolls, against the dealt hand. Position 1 of my ordered list. seed: a100d79baeb2259b

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
