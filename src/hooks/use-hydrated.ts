"use client";

import { useExperience } from "@/store/experience";

/** True once persisted progress has been read from localStorage. */
export const useHydrated = () => useExperience((s) => s.hasHydrated);
