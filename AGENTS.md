<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

- **Check the era before presenting a direction.** A well-crafted world from the wrong decade
  still reads as wrong. Before offering any visual direction, state which decade or period its
  material belongs to and confirm that matches the product's present. Three consecutive
  direction hands were rejected for being period pieces (card catalogue, oscilloscope, theatre
  cyclorama) before this was diagnosed.
- **Instrumentation must never cause what it measures.** The probe originally re-rendered React
  on every pointer move and made the page jank, which then showed up in the page's own frame
  trace. Performance overlays, probes, and telemetry run on refs and direct style writes, never
  on per-event React state.
- **Never judge a render from the first screenshot.** Wait for React to flush and for at least
  one animation frame before concluding something is broken. Several working features were
  reported as bugs because the capture beat the render.
- **The site must hold its own budget.** Runtime targets: LCP under 1.5s, CLS under 0.02, no
  long task over 50ms. A page arguing for engineering rigour that janks is self-refuting.
- **Nothing on screen that is not measured.** Any figure shown in the runtime surface must come
  from a real API (`PerformanceObserver`, rAF deltas, resource timing). Illustrative numbers
  are a product-truth failure here, not a placeholder.
- **Stop the preview server by port, not by name.** `pkill -f "next start"` also matches the
  shell command that runs it and kills the session mid-command. Use `fuser -k <port>/tcp`.
- **Capture 390px through a sized iframe.** Headless Firefox clamps its own viewport to about
  500x758, so a true 390px mobile render is an iframe 396px wide (390 content plus the 6px
  scrollbar) inside the live page, scrolled and stitched segment by segment. A bare 500px
  capture is not the mobile breakpoint target.

