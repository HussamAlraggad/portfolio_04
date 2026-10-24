# portfolio_04

The personal portfolio of Hussam Alraggad — AI software engineer, design-engineering first.

The site is built as a running system rather than a picture of one: it measures its own frame
budget, logs real performance events, and lets visitors probe any element for the component,
source file, DOM node count, and box dimensions behind it. Projects are listed as records, and
the ones with a deployment can be run in place.

## Stack

- Next.js 16.4.2 (App Router), React 19.3, TypeScript
- Tailwind CSS v4
- pnpm

## Commands

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint
```

## Before deploying

Set `NEXT_PUBLIC_SITE_URL` to the public origin at **build** time:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example pnpm build
```

This is what absolute URLs in the metadata resolve against, including the Open Graph image.
Without it the build falls back to `http://localhost:3000`, and social previews will point at
a host nobody can reach. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_URL` are used
automatically when the explicit variable is absent.

## Content

All copy and links live in `src/lib/site.ts`:

- `site` — contact address, handle, GitHub
- `channels` — the contact list rendered in the Channels section
- `projects` — the six project records

Project facts (language, deployment URL, repository) were taken from the GitHub API and the
live deployments. In-progress projects are labelled as such and are not padded with invented
descriptions. Nothing on the page reports a number that was not measured at runtime.

## Notes

- The pulse trace is hidden below the `md` breakpoint; it collided with the telemetry column on
  narrow screens.
- `OS Geeks Hub` sends `X-Frame-Options: DENY` and opens in a new tab instead of running inline.
- Design intent and the direction contract live in `.impeccable/surfaces/`.
