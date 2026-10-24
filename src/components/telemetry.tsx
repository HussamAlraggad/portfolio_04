"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/runtime-store";

type Row = { label: string; value: string; unit?: string };

export default function Telemetry() {
  const { sample } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const rows: Row[] = [
    {
      label: "frame",
      value: sample.frame > 0 ? sample.frame.toFixed(1) : "—",
      unit: "ms",
    },
    { label: "fps", value: sample.fps > 0 ? String(sample.fps) : "—" },
    {
      label: "memory",
      value: sample.memory !== null ? String(sample.memory) : "—",
      unit: sample.memory !== null ? "mb" : undefined,
    },
    {
      label: "fcp",
      value: sample.paint !== null ? String(sample.paint) : "—",
      unit: sample.paint !== null ? "ms" : undefined,
    },
    { label: "requests", value: String(sample.requests) },
    { label: "long tasks", value: String(sample.longTasks) },
  ];

  return (
    <dl
      tabIndex={0}
      aria-label="Live telemetry"
      data-probe="telemetry"
      data-component="<Telemetry>"
      data-source="PerformanceObserver + rAF"
      className="grid w-full max-w-[19rem] grid-cols-2 gap-x-8 gap-y-3"
    >
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {row.label}
          </dt>
          <dd className="tnum font-mono text-[12px] text-ink">
            {row.value}
            {row.unit ? (
              <span className="ml-1 text-[10px] text-faint">{row.unit}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
