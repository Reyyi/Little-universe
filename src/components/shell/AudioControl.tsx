"use client";

import { useExperience } from "@/store/experience";
import { cn } from "@/lib/utils";

export function AudioControl({ className }: { className?: string }) {
  const enabled = useExperience((s) => s.audioEnabled);
  const setEnabled = useExperience((s) => s.setAudioEnabled);

  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound" : "Turn sound on"}
      className={cn("group flex min-h-11 items-center gap-3 px-2 text-mist transition-colors hover:text-paper", className)}
    >
      <span aria-hidden className="flex h-3 items-end gap-[3px]">
        {[0.5, 1, 0.7, 0.9].map((h, i) => (
          <span
            key={i}
            className={cn("w-px bg-current transition-all duration-500", enabled ? "animate-breathe" : "")}
            style={{ height: enabled ? `${h * 100}%` : "2px", animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </span>
      <span className="eyebrow hidden !text-current sm:inline">{enabled ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
