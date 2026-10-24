"use client";

import { useEffect, useRef, useState } from "react";
import { pushEvent } from "@/lib/runtime-store";

type ProbeInfo = {
  name: string;
  component: string;
  source: string;
  nodes: number;
  width: number;
  height: number;
};

function readTarget(element: HTMLElement): ProbeInfo {
  const rect = element.getBoundingClientRect();
  return {
    name: element.dataset.probe ?? "element",
    component: element.dataset.component ?? "—",
    source: element.dataset.source ?? "—",
    nodes: element.querySelectorAll("*").length + 1,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

export default function Probe() {
  const [info, setInfo] = useState<ProbeInfo | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLElement | null>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const place = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const width = panel.offsetWidth || 250;
      const height = panel.offsetHeight || 150;
      const left = Math.min(pointer.current.x + 18, window.innerWidth - width - 12);
      const top = Math.min(pointer.current.y + 18, window.innerHeight - height - 12);
      panel.style.transform = `translate3d(${Math.max(12, left)}px, ${Math.max(12, top)}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };

      const element = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-probe]",
      );

      if (!element) {
        active.current = null;
        setInfo(null);
        return;
      }

      if (active.current !== element) {
        active.current = element;
        const next = readTarget(element);
        setInfo(next);
        pushEvent({
          at: performance.now(),
          label: `inspect ${next.name}`,
          detail: `${next.width}×${next.height}`,
          kind: "interact",
        });
      }

      place();
    };

    const onLeave = () => {
      active.current = null;
      setInfo(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 w-[250px] border border-rule bg-[#0e1013] p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.9)]"
      style={{
        opacity: info ? 1 : 0,
        transition: "opacity 120ms linear",
      }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
        {info?.name ?? "—"}
      </p>
      <dl className="mt-2 space-y-1 font-mono text-[10px] leading-relaxed">
        <div className="flex justify-between gap-3">
          <dt className="text-faint">component</dt>
          <dd className="text-dim">{info?.component ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-faint">source</dt>
          <dd className="max-w-[150px] truncate text-dim">
            {info?.source ?? "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-faint">nodes</dt>
          <dd className="tnum text-dim">{info?.nodes ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-faint">box</dt>
          <dd className="tnum text-dim">
            {info ? `${info.width}×${info.height}` : "—"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
