## 2026-10-24 -- Probe keyboard path and embed states

### What was done

- **Keyboard path for the probe.** The identity block, telemetry and event log are now focusable
  regions (`tabIndex={0}` with accessible names), and the probe listens for `focusin`/`focusout`
  as well as pointer events. On focus the panel anchors beside the region rather than the cursor.
  A visually-hidden `aria-live` region announces the component, source, node count and box for
  screen-reader users, and only when the trigger was focus, so pointer movement stays silent.
- **Embed states.** Each live embed now runs a three-state machine: `loading` (named host,
  "loading in place"), `ready` (overlay removed, iframe visible), and `slow` after a 12 second
  timeout, which states that the deployment may be down and offers both a tab link and the
  source. The timeout is `CONNECT_TIMEOUT_MS`, and the copy derives its number from that
  constant so the two cannot drift apart.
- Footer copy changed from "Move to inspect" to "Move or tab to inspect".

### Interface changes made

- Probed regions gained `tabIndex` and accessible names.
- `Phase` type and `CONNECT_TIMEOUT_MS` constant in `src/components/projects.tsx`.

### What I struggled with / broke

- Verified the failure state by temporarily pointing Maison Fourrure at `http://10.255.255.1/`
  and shortening the timeout to 2.5s. Both were reverted; `grep` confirms the real URL and the
  12s constant are in place. Worth noting: the first version of that copy hardcoded "12 seconds"
  next to a separate literal, which would have drifted the moment the timer changed.
- Programmatic `element.click()` does not move focus in Firefox, so the probe panel stayed
  visible over the Records section during testing. A real click focuses the button and fires
  `focusout`. This is a testing artefact, not a bug, but it is worth knowing before someone
  reports it as one.

### Test status

```
pnpm lint    -> clean
pnpm build   -> Compiled successfully, 4/4 static pages generated
```

Verified in the browser: focus on the identity region shows the panel anchored right with a
focus ring and logs "inspect identity"; Run shows "Connecting" then the real Maison Fourrure
site; an unreachable host produces "No response after 12 seconds" with both recovery links.

### Handoff to next agent

Remaining from the deferred list: mobile pulse redesign, a test suite, the `/impeccable finish`
review, and the deploy step with `NEXT_PUBLIC_SITE_URL`. The finish review should come after the
mobile work, not before.

## 2026-10-24 -- Pushed to origin; remaining work deferred

### What was done

- Pushed `afb4dec` and `b1df6ac` to `origin/main`. Tree is in sync, nothing outstanding.
- Added `DESIGN.md` and `.impeccable/design.json` (previous entry).

### Interface changes made

- None.

### What I struggled with / broke

- Beads is not initialised in this repo, so the deferred items live here rather than as tracked
  issues. Say the word and `bd init` plus one issue per item is a five-minute job.

### Test status

```
pnpm lint    -> clean
pnpm build   -> Compiled successfully, 4/4 static pages generated
git status   -> up to date with origin/main
```

### Handoff to next agent -- deferred to the next session

1. **Embed loading and error states.** If a Netlify deployment is down, the Run control opens a
   blank iframe with no explanation. Needs a loading state and a failure state that names the
   problem and offers the repository.
2. **Keyboard path for the probe.** The probe is pointer-only, while the footer says "Move to
   inspect". Keyboard users get nothing. Either make probed regions focusable and show the
   panel on focus, or change the footer copy to match what exists.
3. **Mobile pulse.** The trace is `hidden md:block` because it collided with telemetry at 390px.
   This is a deviation from the brief and should be redesigned rather than left hidden.
4. **No test suite.** There is nothing to regress against. At minimum: a render smoke test and a
   check that every outbound link in `src/lib/site.ts` resolves.
5. **Deploy step.** Pick a host, then set `NEXT_PUBLIC_SITE_URL` at build time so metadata and the
   Open Graph image resolve to the real origin instead of `localhost:3000`.
6. **`/impeccable finish` review** was never run. The build was self-reviewed, not reviewed by the
   shipped finish reviewer, so treat the current state as unreviewed craft.

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
