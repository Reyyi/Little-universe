"use client";

import { useEffect } from "react";
import { useExperience } from "@/store/experience";
import { startAmbient, stopAmbient } from "@/lib/audio";

/**
 * Keeps the ambient bed in sync with the sound toggle. Browsers block audio
 * until a user gesture, so after a reload we wait for the first interaction.
 */
export function AmbientAudio() {
  const enabled = useExperience((s) => s.audioEnabled);

  useEffect(() => {
    if (!enabled) {
      stopAmbient();
      return;
    }
    const start = () => void startAmbient();
    start();
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [enabled]);

  return null;
}
