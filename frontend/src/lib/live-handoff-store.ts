"use client";

import { useSyncExternalStore } from "react";
import {
  LIVE_CARE_PLAN_KEY,
  LIVE_HANDOFF_KEY,
  LIVE_WORKFLOW_EVENT,
  type LiveCarePlan,
  type LiveHandoff,
} from "@/lib/live-handoff";

function subscribeToLiveWorkflow(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(LIVE_WORKFLOW_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(LIVE_WORKFLOW_EVENT, handler);
  };
}

let handoffSnapshotRaw: string | null = null;
let handoffSnapshotValue: LiveHandoff | null = null;
let carePlanSnapshotRaw: string | null = null;
let carePlanSnapshotValue: LiveCarePlan | null = null;

function getClientHandoffSnapshot(): LiveHandoff | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(LIVE_HANDOFF_KEY);
  if (raw === handoffSnapshotRaw) {
    return handoffSnapshotValue;
  }

  handoffSnapshotRaw = raw;
  if (!raw) {
    handoffSnapshotValue = null;
    return handoffSnapshotValue;
  }

  try {
    handoffSnapshotValue = JSON.parse(raw) as LiveHandoff;
  } catch {
    handoffSnapshotValue = null;
  }
  return handoffSnapshotValue;
}

function getClientCarePlanSnapshot(): LiveCarePlan | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(LIVE_CARE_PLAN_KEY);
  if (raw === carePlanSnapshotRaw) {
    return carePlanSnapshotValue;
  }

  carePlanSnapshotRaw = raw;
  if (!raw) {
    carePlanSnapshotValue = null;
    return carePlanSnapshotValue;
  }

  try {
    carePlanSnapshotValue = JSON.parse(raw) as LiveCarePlan;
  } catch {
    carePlanSnapshotValue = null;
  }
  return carePlanSnapshotValue;
}

function getServerHandoffSnapshot(): LiveHandoff | null {
  return null;
}

function getServerCarePlanSnapshot(): LiveCarePlan | null {
  return null;
}

export function useLiveHandoff(): LiveHandoff | null {
  return useSyncExternalStore(
    subscribeToLiveWorkflow,
    getClientHandoffSnapshot,
    getServerHandoffSnapshot,
  );
}

export function useLiveCarePlan(): LiveCarePlan | null {
  return useSyncExternalStore(
    subscribeToLiveWorkflow,
    getClientCarePlanSnapshot,
    getServerCarePlanSnapshot,
  );
}
