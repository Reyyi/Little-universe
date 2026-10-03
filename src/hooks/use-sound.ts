"use client";

import { useCallback } from "react";
import { playSfx } from "@/lib/audio";
import type { SfxName } from "@/data/site";
import { useExperience } from "@/store/experience";

/** Plays a sound effect only when the visitor has enabled audio. */
export function useSound() {
  const enabled = useExperience((s) => s.audioEnabled);
  return useCallback(
    (name: SfxName | string, volume?: number) => {
      if (enabled) void playSfx(name, volume);
    },
    [enabled],
  );
}
