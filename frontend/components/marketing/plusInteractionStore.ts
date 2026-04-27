"use client";

import { useEffect, useSyncExternalStore } from "react";

type Point = {
  x: number;
  y: number;
};

type ClickPulse = Point & {
  id: number;
};

type PlusInteractionState = {
  mouse: Point | null;
  click: ClickPulse | null;
};

let state: PlusInteractionState = {
  mouse: null,
  click: null,
};

const listeners = new Set<() => void>();
let initialized = false;
let clickResetTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: PlusInteractionState) {
  state = nextState;
  emit();
}

function initializeGlobalTracking() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;

  document.addEventListener("pointermove", (event: PointerEvent) => {
    setState({
      ...state,
      mouse: { x: event.clientX, y: event.clientY },
    });
  });

  document.addEventListener("click", (event: MouseEvent) => {
    setState({
      ...state,
      click: { x: event.clientX, y: event.clientY, id: Date.now() },
    });

    if (clickResetTimer) {
      clearTimeout(clickResetTimer);
    }

    clickResetTimer = setTimeout(() => {
      setState({ ...state, click: null });
    }, 520);
  });

  document.addEventListener("mouseleave", () => {
    setState({ ...state, mouse: null });
  });

  window.addEventListener("blur", () => {
    setState({ ...state, mouse: null });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

export function usePlusInteractionState() {
  useEffect(() => {
    initializeGlobalTracking();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
