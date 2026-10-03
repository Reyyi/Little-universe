"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";
import { CinematicLines } from "@/components/ui/CinematicLines";
import { AchievementSummary } from "./AchievementSummary";

/** Fade to black → two closing lines → replay CTA + a quiet summary. */
export function EndingScene() {
  const [done, setDone] = useState(false);
  const onComplete = useCallback(() => setDone(true), []);
  return (
    <section className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-16 bg-ink-950 px-6 py-24">
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-20 bg-black" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 3, delay: 0.8 }} />
      <h1 className="sr-only">The end</h1>
      <CinematicLines lines={site.ending.lines} hold={3200} onComplete={onComplete} />
      <div className="flex min-h-52 flex-col items-center gap-14">
        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }} className="flex flex-col items-center gap-14">
            <Button asChild size="lg">
              <Link href="/replay">{site.ending.cta}</Link>
            </Button>
            <AchievementSummary />
          </motion.div>
        )}
      </div>
    </section>
  );
}
