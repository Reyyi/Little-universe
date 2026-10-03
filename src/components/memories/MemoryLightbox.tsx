"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { GalleryMemory } from "@/data/types";
import { getLenis } from "@/components/shell/SmoothScroll";

/** Opened memory. The photo travels from the gallery via a shared layoutId. */
export function MemoryLightbox({ memory, onClose }: { memory: GalleryMemory | null; onClose: () => void }) {
  useEffect(() => {
    if (!memory) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [memory, onClose]);

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={memory.title}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close memory" onClick={onClose} className="absolute inset-0 bg-ink-950/90" />
          <div className="relative flex w-full max-w-5xl flex-col gap-6 md:flex-row md:items-end">
            <motion.div
              layoutId={`memory-${memory.id}`}
              className="relative aspect-[4/5] w-full overflow-hidden bg-ink-800 md:w-3/5"
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={memory.photo.src} alt={memory.photo.alt} fill sizes="(min-width:768px) 60vw, 92vw" className="object-cover" priority />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.9 } }}
              exit={{ opacity: 0 }}
              className="relative md:w-2/5"
            >
              <p className="eyebrow">{memory.date}</p>
              <h2 className="display mt-3 text-5xl italic">{memory.title}</h2>
              <p className="mt-4 font-hand text-2xl text-blush">{memory.note}</p>
              <button type="button" onClick={onClose} autoFocus className="eyebrow mt-8 min-h-11 hover:!text-paper">
                Close
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
