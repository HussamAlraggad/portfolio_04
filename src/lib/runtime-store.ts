"use client";

export type RuntimeSample = {
  frame: number;
  fps: number;
  memory: number | null;
  paint: number | null;
  requests: number;
  longTasks: number;
};

export type RuntimeEventKind = "load" | "paint" | "task" | "net" | "interact";

export type RuntimeEvent = {
  id: number;
  at: number;
  label: string;
  detail: string;
  kind: RuntimeEventKind;
};

type Snapshot = {
  sample: RuntimeSample;
  events: RuntimeEvent[];
};

const EMPTY: Snapshot = {
  sample: {
    frame: 0,
    fps: 0,
    memory: null,
    paint: null,
    requests: 0,
    longTasks: 0,
  },
  events: [],
};

let snapshot: Snapshot = EMPTY;
const listeners = new Set<() => void>();
let nextId = 1;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): Snapshot {
  return snapshot;
}

export function getServerSnapshot(): Snapshot {
  return EMPTY;
}

export function setSample(patch: Partial<RuntimeSample>) {
  snapshot = {
    ...snapshot,
    sample: { ...snapshot.sample, ...patch },
  };
  emit();
}

export function pushEvent(
  event: Omit<RuntimeEvent, "id">,
  limit = 7,
) {
  const duplicate = snapshot.events.some(
    (entry) =>
      entry.label === event.label &&
      entry.detail === event.detail &&
      Math.abs(entry.at - event.at) < 250,
  );
  if (duplicate) return;

  const entry: RuntimeEvent = { ...event, id: nextId++ };
  snapshot = {
    ...snapshot,
    events: [entry, ...snapshot.events].slice(0, limit),
  };
  emit();
}
