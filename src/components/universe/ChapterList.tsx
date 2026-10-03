"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { chapters } from "@/data/chapters";
import type { NodeState } from "@/lib/progress";
import { pad2, cn } from "@/lib/utils";
import { nodeLabel } from "./nodeStyles";

/** Mobile chapter navigation: a vertical, tappable star chart. */
export function ChapterList({ states }: { states: Record<string, NodeState> }) {
  return (
    <ol className="relative mx-auto flex w-full max-w-md flex-col gap-3 pl-8">
      <span aria-hidden className="absolute bottom-6 left-3 top-6 w-px bg-gradient-to-b from-gold/50 via-paper/15 to-transparent" />
      {chapters.map((c, i) => {
        const state = states[c.id];
        const open = state === "available" || state === "completed";
        const body = (
          <>
            <span
              aria-hidden
              className={cn(
                "absolute -left-[1.6rem] top-7 size-2 rounded-full",
                state === "available" && "bg-blush shadow-[0_0_14px_3px_rgba(235,207,213,0.5)]",
                state === "completed" && "bg-gold",
                state === "locked" && "bg-mist/40",
                state === "secret" && "animate-twinkle bg-mist/30",
              )}
            />
            <div className="flex items-baseline justify-between">
              <span className="eyebrow tabular-nums">{pad2(c.number)}</span>
              <span className={cn("eyebrow", state === "completed" && "!text-gold", state === "available" && "!text-blush")}>
                {nodeLabel[state]}
              </span>
            </div>
            <span className={cn("display mt-2 block text-4xl", !open && "text-mist/40")}>{state === "secret" ? "? ? ?" : c.title}</span>
            <span className="mt-1 block text-sm text-mist">{state === "secret" ? "Look closely. Find the hidden stars." : c.subtitle}</span>
          </>
        );
        return (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.9 }}
            className="relative"
          >
            {open ? (
              <Link href={c.route} className="relative block border-b hairline py-5 active:opacity-70">
                {body}
              </Link>
            ) : (
              <div className="relative block border-b hairline py-5" aria-label={`${c.title}, ${nodeLabel[state]}`}>
                {body}
              </div>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
