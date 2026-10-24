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

function describe(target: ProbeInfo): string {
  return `${target.name}. Component ${target.component}, source ${target.source}, ${target.nodes} nodes, ${target.width} by ${target.height} pixels.`;
}

export default function Probe() {
  const [info, setInfo] = useState<ProbeInfo | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLElement | null>(null);
  const origin = useRef<"pointer" | "focus">("pointer");

  useEffect(() => {
    const place = (left: number, top: number) => {
      const panel = panelRef.current;
      if (!panel) return;
      const width = panel.offsetWidth || 250;
      const height = panel.offsetHeight || 150;
      const x = Math.min(Math.max(12, left), window.innerWidth - width - 12);
      const y = Math.min(Math.max(12, top), window.innerHeight - height - 12);
      panel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const announce = (target: ProbeInfo) => {
      pushEvent({
        at: performance.now(),
        label: `inspect ${target.name}`,
        detail: `${target.width}×${target.height}`,
        kind: "interact",
      });
    };

    const onMove = (event: PointerEvent) => {
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
        origin.current = "pointer";
        const next = readTarget(element);
        setInfo(next);
        setAnnouncement("");
        announce(next);
      }

      place(event.clientX + 18, event.clientY + 18);
    };

    const onFocusIn = (event: FocusEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-probe]",
      );
      if (!element) return;

      active.current = element;
      origin.current = "focus";
      const next = readTarget(element);
      setInfo(next);
      setAnnouncement(describe(next));
      announce(next);

      const rect = element.getBoundingClientRect();
      const width = panelRef.current?.offsetWidth || 250;
      const fitsRight = rect.right + 12 + width < window.innerWidth - 12;
      place(fitsRight ? rect.right + 12 : rect.left - width - 12, rect.top);
    };

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Element | null;
      if (next?.closest?.("[data-probe]")) return;
      active.current = null;
      setInfo(null);
      setAnnouncement("");
    };

    const onLeave = () => {
      if (origin.current === "focus") return;
      active.current = null;
      setInfo(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

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
    </>
  );
}
