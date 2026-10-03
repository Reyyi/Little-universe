"use client";

import { motion } from "motion/react";
import type { Secret } from "@/data/types";
import { cn } from "@/lib/utils";

interface HiddenStarProps {
  secret: Secret;
  found: boolean;
  onFind: (secret: Secret) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** A tiny, deliberately quiet collectible. Large hit area, small visual. */
export function HiddenStar({ secret, found, onFind, className, style }: HiddenStarProps) {
  return (
    <button
      type="button"
      onClick={() => onFind(secret)}
      disabled={found}
      aria-label={found ? "Hidden star, already found" : "A hidden star"}
      className={cn("group absolute z-30 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center", className)}
      style={style}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className={cn(
          "size-3.5 transition-[opacity,transform] duration-700",
          found ? "text-gold opacity-80" : "animate-twinkle text-paper/70 group-hover:scale-150 group-hover:text-gold group-focus-visible:text-gold",
        )}
        animate={found ? { scale: [1, 1.8, 1], rotate: [0, 90, 72] } : undefined}
        transition={{ duration: 1.2 }}
        aria-hidden
      >
        <path fill="currentColor" d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
      </motion.svg>
    </button>
  );
}
