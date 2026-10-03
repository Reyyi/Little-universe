"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Every route fades up out of black, like a cut in a film.
 * Only opacity is animated so fixed / pinned children keep working.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] bg-ink-950"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
      {children}
    </>
  );
}
