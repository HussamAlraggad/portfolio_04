"use client";

import { useState } from "react";
import { projects } from "@/lib/site";
import type { Project } from "@/lib/site";

function Status({ project }: { project: Project }) {
  const live = project.status === "live";
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em]">
      <span
        aria-hidden="true"
        className={`inline-block size-1.5 rounded-full ${live ? "bg-signal" : "bg-warn"}`}
      />
      <span className={live ? "text-dim" : "text-warn"}>{project.status}</span>
    </span>
  );
}

export default function Projects() {
  const [running, setRunning] = useState<string | null>(null);

  return (
    <section
      id="records"
      aria-label="Project records"
      className="relative z-10 border-t border-rule px-6 py-16 md:px-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em]">
          Records
        </h2>
        <p className="tnum font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {projects.length} filed ·{" "}
          {projects.filter((p) => p.status === "live").length} deployed
        </p>
      </div>

      <ul className="mt-10 border-t border-rule">
        {projects.map((project, index) => {
          const open = running === project.slug;
          return (
            <li key={project.slug} className="border-b border-rule">
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 py-7 md:grid-cols-12 md:items-baseline">
                <p className="tnum font-mono text-[10px] text-faint md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <div className="md:col-span-4">
                  <h3 className="text-[20px] font-medium tracking-[-0.02em]">
                    {project.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    {project.stack} · {project.year}
                  </p>
                </div>

                <p className="max-w-[46ch] text-[13px] leading-relaxed text-dim md:col-span-4">
                  {project.summary}
                </p>

                <div className="md:col-span-1">
                  <Status project={project} />
                </div>

                <div className="flex items-center gap-4 md:col-span-2 md:justify-end">
                  {project.embeddable && project.url ? (
                    <button
                      type="button"
                      onClick={() => setRunning(open ? null : project.slug)}
                      aria-expanded={open}
                      className="border border-rule px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-signal/60 hover:text-signal"
                    >
                      {open ? "Stop" : "Run"}
                    </button>
                  ) : null}

                  {project.url && !project.embeddable ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal underline-offset-4 transition-colors hover:underline"
                    >
                      Open live ↗
                    </a>
                  ) : null}

                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    Source
                  </a>
                </div>
              </div>

              {project.note ? (
                <p className="pb-5 font-mono text-[10px] leading-relaxed text-faint md:pl-[calc(8.333%+2rem)]">
                  {project.note}
                </p>
              ) : null}

              {open && project.url ? (
                <div className="mb-7 border border-rule bg-[#0b0d10]">
                  <div className="flex items-center justify-between border-b border-rule px-4 py-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                      {new URL(project.url).host}
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal underline-offset-4 hover:underline"
                    >
                      Open in tab
                    </a>
                  </div>
                  <iframe
                    src={project.url}
                    title={`${project.name}, running live`}
                    loading="lazy"
                    className="h-[560px] w-full"
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
