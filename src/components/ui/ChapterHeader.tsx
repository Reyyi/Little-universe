"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "@/lib/animation";
import { cn } from "@/lib/utils";

/** Shared opening frame for interactive chapters. */
export function ChapterHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      variants={stagger(0.15, 0.3)}
      initial="hidden"
      animate="show"
      className={cn("mx-auto flex max-w-4xl flex-col items-center px-6 pb-12 pt-32 text-center sm:pt-40", className)}
    >
      <motion.p variants={fadeUp} className="eyebrow">
        {eyebrow}
      </motion.p>
      <motion.h1 variants={fadeUp} className="display mt-5 text-6xl sm:text-8xl">
        {title}
      </motion.h1>
      {children && (
        <motion.div variants={fadeUp} className="mt-6 text-mist">
          {children}
        </motion.div>
      )}
    </motion.header>
  );
}
