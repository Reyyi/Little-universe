"use client";

import { motion } from "motion/react";
import { littleThings } from "@/data/memories";
import { questions } from "@/data/questions";
import { secrets } from "@/data/secrets";
import { useExperience } from "@/store/experience";
import { pad2 } from "@/lib/utils";

export function AchievementSummary() {
  const s = useExperience();
  const items = [
    { label: "Little things", value: `${pad2(s.discoveredMemories.length)} / ${pad2(littleThings.length)}` },
    { label: "Hidden stars", value: `${pad2(s.discoveredSecrets.length)} / ${pad2(secrets.length)}` },
    { label: "Questions", value: `${Object.values(s.quizAnswers).filter((a) => a.correct).length} / ${questions.length}` },
    { label: "Games", value: `${s.completedGames.length} / 3` },
    { label: "Voice letter", value: s.voiceLetterPlayed ? "Heard" : "Saved for later" },
  ];
  return (
    <motion.dl
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } }}
      className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-5"
      aria-label="Your journey"
    >
      {items.map((it) => (
        <motion.div key={it.label} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 1 } } }} className="text-center">
          <dt className="eyebrow !text-[0.6rem]">{it.label}</dt>
          <dd className="mt-2 font-display text-2xl tabular-nums text-paper">{it.value}</dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}
