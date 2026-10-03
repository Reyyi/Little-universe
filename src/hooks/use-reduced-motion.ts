"use client";

import { useExperience } from "@/store/experience";
import { useMediaQuery } from "./use-media-query";

/** Combines the OS setting with the in-experience override. */
export function useReducedMotion() {
  const system = useMediaQuery("(prefers-reduced-motion: reduce)");
  const pref = useExperience((s) => s.motionPreference);
  if (pref === "reduced") return true;
  if (pref === "full") return false;
  return system;
}
