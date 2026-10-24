## 2026-10-24 -- Finish review, no-JS state, raster provenance

### What was done

- **Finish review run.** Code-led build, no comp: the surface was judged against the direction
  contract's OWN-WORLD and the craft floor. Verdict: **ship**, with the fixes below applied in
  the same pass. No contradicted or missing rows remain.
- **Contrast fixed system-wide.** `--color-faint` was 3.18:1 on the ground at 10-11px — a WCAG
  AA failure across roughly 45 labels, timestamps, notes and footer lines. Raised to #7a817c
  (4.99:1). Verified by a computed-style audit over every text node: zero failures at 1440 and
  at 390.
- **Mono stopped setting prose.** The two record notes were 10px JetBrains Mono sentences,
  which DESIGN.md's Two-Voice Rule forbids. They are now 13px Archivo at 46ch, indented with
  margin rather than padding so the measure is not eaten by the indent.
- **Designed no-JS state.** A `<noscript>` style hides the canvas, the Run controls and the
  "move or tab to inspect" hint; a note in the telemetry column states that the runtime layer
  needs JavaScript and that the records and channels below are static. Captured with JavaScript
  disabled at both widths.
- **Event log is chronological.** `pushEvent` sorted by time; the log had been showing
  0.060s / 0.032s / 0.054s because entries were prepended in push order, not time order.
- **"Heaviest asset" renamed "largest transfer".** It reads `transferSize`, which is 0 for
  cached files, so the old label could call a 6kb file the heaviest on a repeat visit.
- **Trace labels no longer collide.** Labels within 76px of the previously drawn one are
  skipped; ticks remain. Two events 11ms apart were overprinting at the right edge.
- **Raster provenance.** `src/app/opengraph-image.png` now carries a PNG tEXt origin (authored
  in-repo for this build, composed from the Runtime tokens, no external or generated source).
  `impeccable embed-prompt --scan src/app public` reports 0 missing.
- **Documentation reconciled.** DESIGN.md and `.impeccable/design.json` carry the new muted-grey
  value; the sidecar's canonical/ramp and `generatedAt` were updated to match.

### Interface changes made

- `--color-faint`: #5b625e → #7a817c.
- Record notes: sans 13px dim, `md:ml-` instead of `md:pl-`.
- `data-requires-js` on the canvas, the Run buttons and the footer hint; `<noscript>` note and
  style rule in `src/app/page.tsx`.
- `RuntimeEvent` ordering: `pushEvent` now sorts by `at` descending before capping at 7.
- `Pulse` skips event labels closer than 76px to the previous one.

### What I struggled with / broke

- **The shipped finish reviewer and documenter could not be spawned.** The harness enforces a
  subagent depth limit of 1, and this session is already a subagent, so both roles ran inline
  against `reference/degraded/finish-reviewer.md` and `reference/degraded/documenter.md`. The
  substitution is disclosed in the report; the review is the builder's own pass, which is
  weaker than a fresh context. An independent pass is still worth doing when one is available.
- **`pkill -f "next start --port 3111"` killed my own shell**, because the pattern matched the
  command line of the shell running it. Use `fuser -k <port>/tcp`. Rule added to AGENTS.md.
- **Headless Firefox clamps its viewport at about 500x758**, so the 390px capture is an iframe
  396px wide (390 content + 6px scrollbar) inside the live page, scrolled in 844px segments and
  stitched. The seams land on section boundaries and no element is sticky or fixed in the
  scrolled region, so the stitch is exact. Rule added to AGENTS.md.
- The first capture of the trace caught the 5-second history buffer half-filled, which reads as
  a flat line with a startup spike. The settled capture waits 6s; the half-filled state is
  honest but not the page's steady look.

### Test status

```
pnpm lint                    -> clean
pnpm build                   -> Compiled successfully, 5/5 static pages
impeccable detect --json src -> []
embed-prompt --scan          -> 1 raster, 0 missing
contrast audit (1440/390)    -> 0 failures
overflow-x (1440/390)        -> none
FCP 15-32 ms · long tasks 0 · layout shifts 0 · DOM 259
```

Interactions driven at 1440: identity focused (probe panel opens beside the block, live region
announces, no clipping), Maison Fourrure Run (connecting overlay, then the live embed),
no-JS at both widths.

### Handoff to next agent

- **Verdict scope:** `ship` covers the surface as captured after the fix batch. It is not a
  substitute for the independent review the degraded path could not provide.
- Remaining work: a test suite, the deploy step with `NEXT_PUBLIC_SITE_URL`, and the mobile
  footer copy "move or tab to inspect", which says "move" on a touch screen where the gesture
  is a tap (tapping a focusable region does focus it and open the probe).
- The preview server for this pass ran on port 3111; stop it by port, not by process name.

## 2026-10-24 -- Mobile pulse restored, type ramp reconciled

### What was done

- **The pulse is no longer hidden on mobile.** It renders as a 108px strip in the flow between
  the hero content and the footer, and becomes the full-bleed absolute layer from `md` up. The
  draw routine detects a short canvas (`height < 260`) and switches to strip geometry: mid at
  44%, floor at the bottom edge, amplitude from the height, and the time labels dropped.
- **Removed `overflow-hidden` from the hero section.** The footer was being clipped by 21px at a
  758px viewport because the section was pinned to `min-h-dvh` while its children overflowed.
  The section now grows, and nothing is cut.
- Tightened mobile spacing (`py-8`, `gap-10`) so the hero fits a single viewport again.
- **Reconciled the type ramp.** The detector flagged nine font sizes absent from DESIGN.md. The
  real system uses `lead` (17px), `small` (13px), `label-sm` (11px) and `value` (12px) beyond the
  five canonical roles, so those were documented in DESIGN.md and the sidecar. One genuine
  outlier — a 14px paragraph in Channels — was changed to 15px.

### Interface changes made

- `Pulse` positioning is responsive: relative strip below `md`, absolute `-z-10` above.
- Four typography roles added to DESIGN.md and `.impeccable/design.json`.

### What I struggled with / broke

- `set_viewport_size` would not go below 500×758 in this Firefox session, so the 390×844 case was
  verified at 500×758 — same breakpoint, narrower content, but not the exact target width. Worth
  re-checking on a real device or a working viewport override.
- Screenshots repeatedly beat the first canvas draw; the strip looked blank until a later capture.
  Same failure mode as earlier in this project: never judge a render from the first frame.
- I assumed the detector only read the five canonical typography roles and could not be cleared.
  It matched by value; changing the single 14px outlier took the report from nine findings to zero.

### Test status

```
pnpm lint    -> clean
pnpm build   -> Compiled successfully, 4/4 static pages generated
impeccable detect --json src -> 0 findings
```

Verified in the browser at 500×758 and 1440×814: strip present on mobile with the footer fully
visible, desktop composition unchanged.

### Handoff to next agent

Remaining: a test suite, the `/impeccable finish` review, and the deploy step with
`NEXT_PUBLIC_SITE_URL`. The finish review is next in line — the known layout issue is closed.

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
