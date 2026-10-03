"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { GameId } from "@/data/types";
import { useExperience } from "@/store/experience";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { Button } from "@/components/ui/button";
import { secrets } from "@/data/secrets";
import { pad2, cn } from "@/lib/utils";

const games: { id: GameId; href: string; numeral: string; title: string; body: string }[] = [
  { id: "quiz", href: "/game/quiz", numeral: "I", title: "Questions", body: "Five questions about us. No wrong answers — only gentle ones." },
  { id: "timeline", href: "/game/timeline", numeral: "II", title: "Timeline", body: "Put our moments back in the order they happened." },
  { id: "find", href: "/game/find", numeral: "III", title: "Hidden Stars", body: "Seven stars are hidden across this universe. Have you seen them?" },
];

/** Hierarchy: title → three game "doors" in a row (stacked on mobile). */
export function GameHub() {
  const completed = useExperience((s) => s.completedGames);
  const found = useExperience((s) => s.discoveredSecrets.length);
  const allDone = games.every((g) => completed.includes(g.id));

  return (
    <div className="pb-24">
      <ChapterHeader eyebrow="Chapter 04" title="The Game">
        <p className="max-w-md">Three small games. Play them in any order.</p>
      </ChapterHeader>
      <ul className="mx-auto grid max-w-6xl gap-px bg-paper/10 px-0 sm:grid-cols-3">
        {games.map((g, i) => {
          const done = completed.includes(g.id);
          return (
            <motion.li
              key={g.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 1 }}
              className="bg-ink-950"
            >
              <Link href={g.href} className="group flex min-h-72 flex-col justify-between p-8 transition-colors duration-700 hover:bg-ink-900 sm:min-h-96">
                <div className="flex items-baseline justify-between">
                  <span className="display text-6xl italic text-paper/20 transition-colors duration-700 group-hover:text-gold/60">{g.numeral}</span>
                  <span className={cn("eyebrow", done && "!text-gold")}>
                    {done ? "Complete" : g.id === "find" ? `${pad2(found)} / ${pad2(secrets.length)}` : "Play"}
                  </span>
                </div>
                <div>
                  <h2 className="display text-4xl transition-transform duration-700 group-hover:translate-x-1">{g.title}</h2>
                  <p className="mt-3 text-sm text-mist">{g.body}</p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      {allDone && (
        <div className="mt-16 flex justify-center">
          <Button asChild>
            <Link href="/letter">You did it — there is a letter waiting</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
