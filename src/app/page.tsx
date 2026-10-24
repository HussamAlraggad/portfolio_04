import EventLog from "@/components/event-log";
import Channels from "@/components/channels";
import Probe from "@/components/probe";
import Projects from "@/components/projects";
import Pulse from "@/components/pulse";
import Telemetry from "@/components/telemetry";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-dvh flex-col">
        <header className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-rule px-6 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-faint">
            Runtime <span className="text-signal">/</span> 001
          </p>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            <span className="inline-block size-1.5 rounded-full bg-signal" />
            Open to internships
          </p>
        </header>

        <div className="relative z-10 grid flex-1 grid-cols-1 gap-10 px-6 py-8 md:px-10 lg:grid-cols-12 lg:gap-8 lg:py-10">
          <div className="flex flex-col justify-between gap-10 lg:col-span-6">
            <div
              tabIndex={0}
              role="group"
              aria-label="Identity"
              data-probe="identity"
              data-component="<Home>"
              data-source="src/lib/site.ts"
            >
              <h1 className="text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.035em]">
                Hussam
                <br />
                Alraggad
              </h1>
              <p className="mt-8 max-w-[34ch] text-[15px] leading-relaxed text-dim">
                AI software engineer. Frontend, systems, and the tooling that
                builds them.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${site.contactEmail}`}
                data-probe="correspondence"
                data-component="<Home>"
                data-source="mailto"
                className="group inline-flex w-fit items-center gap-4 border border-rule px-5 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-ink transition-colors hover:border-signal/60 hover:text-signal"
              >
                Correspondence
                <span
                  aria-hidden="true"
                  className="text-signal transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
            <Telemetry />
            <EventLog />
          </div>
        </div>

        <Pulse />

        <footer className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-rule px-6 py-4 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Master&apos;s candidate · 2026
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Move or tab to inspect
          </p>
        </footer>
      </section>

      <Projects />
      <Channels />
      <Probe />
    </>
  );
}
