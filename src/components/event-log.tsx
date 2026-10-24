"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/runtime-store";

const KIND_MARK: Record<string, string> = {
  load: "·",
  paint: "▸",
  task: "!",
  net: "→",
  interact: "↔",
};

export default function EventLog() {
  const { events } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <section
      aria-label="Runtime events"
      data-probe="event log"
      data-component="<EventLog>"
      data-source="PerformanceObserver"
      className="w-full max-w-[26rem]"
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
        Events
      </h2>

      <ol className="mt-3 space-y-1.5 font-mono text-[11px] leading-relaxed">
        {events.length === 0 ? (
          <li className="text-faint">waiting for the first event</li>
        ) : null}

        {events.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span className="tnum w-14 shrink-0 text-faint">
              {Math.max(0, event.at / 1000).toFixed(3)}s
            </span>
            <span
              aria-hidden="true"
              className={event.kind === "task" ? "text-warn" : "text-signal"}
            >
              {KIND_MARK[event.kind] ?? "·"}
            </span>
            <span className="min-w-0 flex-1 truncate text-dim">
              {event.label}
            </span>
            <span className="tnum hidden shrink-0 text-faint sm:inline">
              {event.detail}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
