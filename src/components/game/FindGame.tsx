"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "motion/react";
import { secrets } from "@/data/secrets";
import { useExperience } from "@/store/experience";
import { Button } from "@/components/ui/button";
import { pad2, cn } from "@/lib/utils";

/** Progress board for the hidden stars scattered across other pages. */
export function FindGame() {
  const found = useExperience((s) => s.discoveredSecrets);
  const completeGame = useExperience((s) => s.completeGame);
  const count = secrets.filter((s) => found.includes(s.id)).length;
  const done = count === secrets.length;

  useEffect(() => {
    if (done) completeGame("find");
  }, [done, completeGame]);

  return (
    <section className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center px-6 py-28">
      <p className="eyebrow text-center">Game III</p>
      <h1 className="display mt-4 text-center text-6xl italic sm:text-7xl">Hidden Stars</h1>
      <p className="display mt-10 text-center text-7xl tabular-nums sm:text-8xl" aria-label={`${count} of ${secrets.length} found`}>
        <span className="text-gold">{pad2(count)}</span>
        <span className="text-mist/40"> / {pad2(secrets.length)}</span>
      </p>
      <p className="mx-auto mt-4 max-w-sm text-center text-sm text-mist">
        Tiny stars are tucked into the pages of this universe. Tap one when you see it.
      </p>
      <ol className="mt-12 divide-y divide-paper/10 border-y hairline">
        {secrets.map((s, i) => {
          const isFound = found.includes(s.id);
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex min-h-16 items-center gap-5 py-4"
            >
              <span aria-hidden className={cn("text-lg", isFound ? "text-gold" : "text-paper/20")}>✦</span>
              <div className="flex-1">
                <p className={cn("font-display text-xl", isFound ? "italic text-paper" : "text-mist")}>{isFound ? s.reward : s.hint}</p>
              </div>
              <span className={cn("eyebrow", isFound && "!text-gold")}>{isFound ? "Found" : "Hidden"}</span>
            </motion.li>
          );
        })}
      </ol>
      <div className="mt-12 flex justify-center">
        <Button asChild>
          <Link href={done ? "/secrets" : "/universe"}>{done ? "A door has opened" : "Go looking"}</Link>
        </Button>
      </div>
    </section>
  );
}
