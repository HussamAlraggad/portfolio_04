"use client";

import { useEffect, useRef } from "react";
import { getSnapshot, pushEvent, setSample, subscribe } from "@/lib/runtime-store";
import type { RuntimeEvent } from "@/lib/runtime-store";

const CAPACITY = 300;
const TARGET_FRAME = 16.7;
const AMPLITUDE = 200;
const SENSITIVITY = 14;
const WINDOW_MS = 5000;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function Pulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const deltas: number[] = new Array(CAPACITY).fill(TARGET_FRAME);
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let sampleClock = 0;
    let longTasks = 0;
    let paintAt: number | null = null;
    let events: RuntimeEvent[] = [];

    const unsubscribe = subscribe(() => {
      events = getSnapshot().events;
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now = performance.now()) => {
      if (width === 0 || height === 0) return;
      const strip = height < 260;
      const mid = strip ? height * 0.44 : height * 0.56;
      const floor = strip ? height - 4 : mid + 168;
      const amp = strip ? height * 0.36 : AMPLITUDE;
      const step = width / (CAPACITY - 1);

      ctx.clearRect(0, 0, width, height);

      const point = (index: number) => {
        const value = (deltas[index] - TARGET_FRAME) * SENSITIVITY;
        return mid - clamp(value, -amp, amp);
      };

      ctx.strokeStyle = "rgba(233,234,231,0.03)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += width / 10) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      ctx.stroke();

      const fill = ctx.createLinearGradient(0, mid - 40, 0, floor);
      fill.addColorStop(0, "rgba(91,228,155,0.10)");
      fill.addColorStop(0.45, "rgba(91,228,155,0.028)");
      fill.addColorStop(1, "rgba(91,228,155,0)");

      ctx.beginPath();
      ctx.moveTo(0, point(0));
      for (let i = 1; i < CAPACITY; i += 1) ctx.lineTo(i * step, point(i));
      ctx.lineTo(width, floor);
      ctx.lineTo(0, floor);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < CAPACITY; i += 1) {
        const x = i * step;
        const y = point(i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(91,228,155,0.10)";
      ctx.lineWidth = 7;
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.strokeStyle = "rgba(91,228,155,0.98)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.strokeStyle = "rgba(233,234,231,0.16)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 7]);
      ctx.beginPath();
      ctx.moveTo(0, mid + 0.5);
      ctx.lineTo(width, mid + 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(91,228,155,1)";
      ctx.beginPath();
      ctx.arc(
        (CAPACITY - 1) * step - 2,
        point(CAPACITY - 1),
        3,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.font = "10px ui-monospace, monospace";

      for (const event of events) {
        const age = now - event.at;
        if (age < 0 || age > WINDOW_MS) continue;
        const x = width - (age / WINDOW_MS) * width;
        const warn = event.kind === "task";
        ctx.strokeStyle = warn
          ? "rgba(224,162,43,0.55)"
          : "rgba(233,234,231,0.30)";
        ctx.beginPath();
        ctx.moveTo(x + 0.5, floor);
        ctx.lineTo(x + 0.5, floor - 16);
        ctx.stroke();
        ctx.fillStyle = warn
          ? "rgba(224,162,43,0.85)"
          : "rgba(233,234,231,0.42)";
        ctx.fillText(event.label, x + 5, floor - 20);
      }

      ctx.fillStyle = "rgba(233,234,231,0.4)";
      ctx.fillText("16.7 ms budget", 24, strip ? 18 : mid - 14);
      if (!strip) {
        ctx.fillStyle = "rgba(233,234,231,0.22)";
        ctx.fillText("-5 s", 24, floor + 18);
        ctx.fillText("now", width - 52, floor + 18);
      }
    };

    const tick = (now: number) => {
      const delta = now - last;
      last = now;

      if (delta > 0 && delta < 500) {
        deltas.push(delta);
        deltas.shift();
      }

      if (!reduced || now - sampleClock > 250) {
        draw(now);
      }

      if (now - sampleClock > 250) {
        sampleClock = now;
        let sum = 0;
        for (let i = deltas.length - 60; i < deltas.length; i += 1) {
          sum += deltas[i];
        }
        const frame = sum / 60;
        const memory =
          "memory" in performance && performance.memory
            ? Math.round(
                (performance.memory as { usedJSHeapSize: number })
                  .usedJSHeapSize / 1048576,
              )
            : null;

        setSample({
          frame: Number(frame.toFixed(1)),
          fps: Math.round(1000 / frame),
          memory,
          paint: paintAt,
          requests: performance.getEntriesByType("resource").length,
          longTasks,
        });
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);

    const paintEntries = performance.getEntriesByType(
      "paint",
    ) as PerformanceEntry[];
    for (const entry of paintEntries) {
      if (entry.name === "first-contentful-paint") {
        paintAt = Math.round(entry.startTime);
      }
      pushEvent({
        at: entry.startTime,
        label: entry.name.replace(/-/g, " "),
        detail: `${Math.round(entry.startTime)} ms`,
        kind: "paint",
      });
    }

    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    if (resources.length > 0) {
      const heaviest = resources.reduce((a, b) =>
        (b.transferSize ?? 0) > (a.transferSize ?? 0) ? b : a,
      );
      const name = heaviest.name.split("/").pop()?.split("?")[0] ?? "asset";
      pushEvent({
        at: heaviest.startTime,
        label: "heaviest asset",
        detail: `${name} · ${Math.round((heaviest.transferSize ?? 0) / 1024)} kb`,
        kind: "net",
      });
    }

    let shift = 0;
    const taskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTasks += 1;
        pushEvent({
          at: entry.startTime,
          label: "long task",
          detail: `${Math.round(entry.duration)} ms`,
          kind: "task",
        });
      }
    });

    const shiftObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const amount =
          (entry as PerformanceEntry & { value?: number }).value ?? 0;
        shift += amount;
        if (amount > 0.01) {
          pushEvent({
            at: entry.startTime,
            label: "layout shift",
            detail: `cls ${shift.toFixed(3)}`,
            kind: "task",
          });
        }
      }
    });

    try {
      taskObserver.observe({ type: "longtask", buffered: true });
    } catch {
      /* longtask is unsupported in this browser */
    }
    try {
      shiftObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* layout-shift is unsupported in this browser */
    }

    pushEvent({
      at: performance.now(),
      label: "runtime attached",
      detail: "observers live",
      kind: "load",
    });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      resizeObserver.disconnect();
      taskObserver.disconnect();
      shiftObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-probe="pulse trace"
      data-component="<Pulse>"
      data-source="requestAnimationFrame deltas"
      className="pointer-events-none relative h-[108px] w-full md:absolute md:inset-0 md:-z-10 md:h-full"
    />
  );
}
