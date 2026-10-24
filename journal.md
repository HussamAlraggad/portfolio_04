## 2026-10-24 -- Channels section and live-link handling

### What was done

- Added `Channel` type and a six-entry `channels` array to `src/lib/site.ts`: email, GitHub,
  LinkedIn, Dribbble, Behance, Instagram, each with a real handle derived from the supplied URL.
- Built `src/components/channels.tsx` as the closing section after Records, with the email
  listed first and a line stating that email is answered first.
- Social links carry `rel="me noreferrer noopener"` so the identity is machine-readable.
- OS Geeks Hub now renders an "Open live ↗" link beside Source, and its note reads in plain
  language: "Opens in a new tab. The site blocks embedding, so it cannot run in place here."
- Left mini_wiki 2.0 as a record per the user's instruction.

### Interface changes made

- `Channel` type: `label`, `handle`, `href`, `external`.
- `channels` export added to `src/lib/site.ts`.

### What I struggled with / broke

- Nothing broke this round. Verified every outbound URL and `rel` value from the live DOM
  rather than trusting the source.

### Test status

```
pnpm lint    -> clean (no output)
pnpm build   -> Compiled successfully, TypeScript finished, 4/4 static pages generated
```

### Handoff to next agent

- **Still missing against the brief:** project detail surfaces, the probe's keyboard path,
  the designed no-JS fallback, `DESIGN.md`, and the finish review. The build is not finished.
- The pulse is still hidden below `md`.
- Records rows have no loading or error state if an embedded deployment is down.

## 2026-10-24 -- Assets wired and Records layer built

### What was done

- Wired the real contact address and GitHub into `src/lib/site.ts`; the Correspondence
  control now renders a live `mailto:` instead of the pending state.
- Pulled real metadata for all six repositories from the GitHub API rather than describing
  them from memory: language, last push, size, deployment URL, and README content.
- Added the `Project` type and a six-entry `projects` array to `src/lib/site.ts`.
- Built `src/components/projects.tsx`: a Records section with index, name, stack, year,
  status, summary, source link, and a Run control for projects that can be embedded.
- Restructured `src/app/page.tsx` so the pulse canvas is scoped to the first viewport
  section rather than the whole document, with Records following below.

### Interface changes made

- `Project` type: `slug`, `name`, `summary`, `stack`, `year`, `status`, `repo`, optional
  `url`, `embeddable`, `note`.
- `site.contactEmail` and `site.github` are now populated.

### What I struggled with / broke

- `os_geeks_hub_02` sends `X-Frame-Options: DENY`, so it cannot run embedded. Rather than
  fake it, the row carries a note explaining why it opens in a tab.
- `school_lms_template` redirects 307 to `/ar/login`, so its embed lands on a login screen.
  That is the real deployed behaviour and is left as-is rather than hidden.
- Two projects (`pms_project_management_system_01`, `men_fashion_e_commernce_01`) have no
  deployment and almost no content. They are listed as in progress with the repository as
  the record, not padded with invented descriptions.
- Clicking Run appeared not to work during verification; it was the screenshot beating
  React's render again. Confirmed working by reading `aria-expanded` and the mounted iframe.

### Test status

```
pnpm lint    -> clean (no output)
pnpm build   -> Compiled successfully, TypeScript finished, 4/4 static pages generated
```

Verified in the browser: `mailto:hussamraedalraggad@gmail.com`, GitHub link correct, and
the Maison Fourrure deployment running live inside the page via iframe.

### Handoff to next agent

- **Still missing against the brief:** the project detail surfaces, the probe's keyboard
  path, the designed no-JS fallback, `DESIGN.md`, and the finish review. The build is not
  finished.
- `mini_wiki 2.0` is the strongest AI-engineering evidence in the set (Go, local agentic
  ranking, RAG, TUI) but has no deployment. It needs a different presentation than an
  embed: a terminal recording or a documented walkthrough would be honest; a fake TUI
  would not.
- The pulse is hidden below `md`. Still an open deviation.
- Records rows are not yet keyboard-expandable beyond the Run button, and the iframe has no
  loading or error state if the deployment is down.

## 2026-10-24 -- Runtime: direction chosen and first viewport built

### What was done

- Ran `/impeccable init` output into `PRODUCT.md`, then corrected it twice from user answers:
  positioning now says AI software engineering means AI as leverage inside a disciplined
  build process, explicitly not vibe coding; audiences now say internships and early-career
  roles rather than full-time roles.
- Ran three direction rolls. The user rejected all three hands. Diagnosis recorded below.
- Committed to **Runtime** (user-pinned, beats the roll): the portfolio as a running system,
  not a picture of one.
- Wrote the surface brief and direction contract to
  `.impeccable/surfaces/src-app-page-tsx.md`.
- Built the first viewport: `src/app/page.tsx`, `src/components/pulse.tsx`,
  `src/components/telemetry.tsx`, `src/components/event-log.tsx`,
  `src/components/probe.tsx`, `src/lib/runtime-store.ts`, `src/lib/site.ts`,
  tokens in `src/app/globals.css`, fonts in `src/app/layout.tsx`.

### Interface changes made

- `RuntimeSample` and `RuntimeEvent` types in `src/lib/runtime-store.ts`.
- `site` config object in `src/lib/site.ts` with `contactEmail`, `handle`, `github` all `null`.
  The Correspondence control renders a designed pending state until `contactEmail` is set.
- Replaced the create-next-app scaffold page and fonts (Archivo + JetBrains Mono).

### What I struggled with / broke

- **Three direction hands were all period pieces.** Card catalogue, patent sheet, star atlas,
  1970s oscilloscope, 2003 social network, theatre cyclorama. The user kept saying "great,
  but." The craft was fine; the era was wrong. That is a selection failure, not a taste
  mismatch. Rule added to `AGENTS.md`.
- **The probe re-rendered React on every pointermove.** It janked the page it was measuring,
  and the jank was visible in the pulse trace. Rewritten so position updates go through a
  direct `transform` on a ref and only target changes touch state.
- **The probe panel was painted under the canvas.** `<Probe />` lived inside `<main>`, which
  has `isolate`; moving it outside `main` fixed the stacking.
- **Repeatedly judged screenshots taken before React flushed or before the first animation
  frame.** Several "broken" states were working features captured too early. Rule added.
- **Mobile collision.** The pulse band sat behind the telemetry and event log at 390px. The
  canvas is now `hidden md:block`, which is a deviation from the brief's "mobile keeps the
  pulse" and should be revisited rather than left.
- The trace is flat on a healthy page. In this headless browser rAF deltas are exactly
  16.7ms, so any honest performance signal is a straight line. Event markers were added to
  give the band real texture; they scroll out after 5 seconds.

### Test status

```
pnpm build   -> Compiled successfully, TypeScript finished, 4/4 static pages generated
pnpm lint    -> clean (no output)
```

No test suite exists in this repo yet.

### Handoff to next agent

- **Not built yet:** project layers with live modules, the probe's keyboard path, the no-JS
  fallback, and `DESIGN.md`. The direction contract requires all of them before the build is
  finished.
- `src/app/page.tsx` is one viewport. The brief calls for scroll to convert into layers where
  projects execute in place; that is the next unit of work.
- Open decisions still blocking content: contact email, handle, GitHub URL, domain, and the
  real project list. `src/lib/site.ts` is where the contact wiring goes.
- The pulse's `setSample` runs from the Pulse component's rAF loop, so telemetry depends on
  Pulse being mounted. If Pulse is ever unmounted, telemetry freezes. Worth decoupling.
- Mobile pulse deviation is deliberate but unresolved; see above.
