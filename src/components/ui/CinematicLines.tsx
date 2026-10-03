"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CinematicLinesProps {
  lines: readonly string[];
  /** ms each line is held before the next appears */
  hold?: number;
  /** "stack" keeps previous lines, "replace" crossfades them */
  mode?: "stack" | "replace";
  onComplete?: () => void;
  className?: string;
  lineClassName?: string;
}

/** Title-sequence style text: lines appear one by one, word by word. */
export function CinematicLines({
  lines,
  hold = 2200,
  mode = "stack",
  onComplete,
  className,
  lineClassName,
}: CinematicLinesProps) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(reduced ? lines.length : 1);

  useEffect(() => {
    if (visible >= lines.length) {
      const id = window.setTimeout(() => onComplete?.(), reduced ? 0 : hold * 0.6);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setVisible((v) => v + 1), hold);
    return () => window.clearTimeout(id);
  }, [visible, lines.length, hold, onComplete, reduced]);

  const shown = mode === "stack" ? lines.slice(0, visible) : [lines[visible - 1]];

  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)} aria-live="polite">
      <AnimatePresence mode={mode === "replace" ? "wait" : "sync"}>
        {shown.map((line, li) => (
          <motion.p
            key={line}
            exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.8 } }}
            className={cn("display text-balance text-4xl sm:text-6xl", li > 0 && mode === "stack" && "text-mist", lineClassName)}
          >
            {line.split(" ").map((word, wi) => (
              <motion.span
                key={wi}
                className="inline-block whitespace-pre"
                initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: wi * 0.09, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {word + " "}
              </motion.span>
            ))}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}
