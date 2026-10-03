"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { chapters } from "@/data/chapters";
import { useExperience, type MotionPreference } from "@/store/experience";
import { chapterState } from "@/lib/progress";
import { pad2, cn } from "@/lib/utils";
import { getLenis } from "./SmoothScroll";

const motionOptions: { value: MotionPreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "full", label: "Full" },
  { value: "reduced", label: "Reduced" },
];

/** Mobile-safe chapter navigation. Opened from the HUD, never shown by default. */
export function ChapterMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const progress = useExperience();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a,button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      prev?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Chapters"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[80] flex flex-col bg-ink-950/95 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 backdrop-blur-sm sm:px-16"
        >
          <button
            type="button"
            onClick={onClose}
            className="eyebrow absolute right-4 top-[max(1rem,env(safe-area-inset-top))] min-h-11 px-3 hover:!text-paper sm:right-8 sm:top-6"
          >
            Close
          </button>
          <nav aria-label="Chapters" className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto">
            <Link href="/universe" onClick={onClose} className="eyebrow mb-8 inline-flex min-h-11 items-center hover:!text-gold">
              ← The universe
            </Link>
            <ol className="space-y-1">
              {chapters.map((c, i) => {
                const state = chapterState(c, progress);
                const locked = state === "locked" || state === "secret";
                const title = state === "secret" ? "? ? ?" : c.title;
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i + 0.1, duration: 0.7 }}
                    className="border-b hairline"
                  >
                    {locked ? (
                      <div className="flex min-h-16 items-baseline gap-6 py-4 text-mist/50" aria-label={`${title}, locked`}>
                        <span className="eyebrow tabular-nums">{pad2(c.number)}</span>
                        <span className="display text-3xl sm:text-5xl">{title}</span>
                        <span className="eyebrow ml-auto">Locked</span>
                      </div>
                    ) : (
                      <Link
                        href={c.route}
                        onClick={onClose}
                        className="group flex min-h-16 items-baseline gap-6 py-4 transition-colors hover:text-gold"
                      >
                        <span className="eyebrow tabular-nums">{pad2(c.number)}</span>
                        <span className="display text-3xl transition-transform duration-700 group-hover:translate-x-2 sm:text-5xl">
                          {title}
                        </span>
                        <span className={cn("eyebrow ml-auto", state === "completed" && "!text-gold")}>
                          {state === "completed" ? "Visited" : "Open"}
                        </span>
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ol>
          </nav>
          <div className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center gap-4">
            <span className="eyebrow">Motion</span>
            <div role="radiogroup" aria-label="Motion preference" className="flex gap-1">
              {motionOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={progress.motionPreference === o.value}
                  onClick={() => progress.setMotionPreference(o.value)}
                  className={cn(
                    "eyebrow min-h-11 border px-4 transition-colors",
                    progress.motionPreference === o.value ? "border-gold !text-gold" : "border-transparent hover:!text-paper",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
