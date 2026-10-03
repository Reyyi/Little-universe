"use client";

import { useExperience } from "@/store/experience";
import { overallProgress } from "@/lib/progress";

export function ProgressIndicator() {
  const progress = useExperience(overallProgress);
  const pct = Math.round(progress * 100);
  return (
    <div
      role="progressbar"
      aria-label="Story progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="flex items-center gap-3"
    >
      <div className="relative h-px w-16 overflow-hidden bg-paper/15 sm:w-24">
        <div
          className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-1000 ease-[var(--ease-cinema)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="eyebrow tabular-nums">{String(pct).padStart(2, "0")}%</span>
    </div>
  );
}
