"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { site } from "@/data/site";
import { useExperience } from "@/store/experience";
import { fadeUp, stagger } from "@/lib/animation";
import { Button } from "@/components/ui/button";

/** New Game+: keep discoveries and open every door, or wipe the slate clean. */
export function ReplayScene() {
  const router = useRouter();
  const startNewGamePlus = useExperience((s) => s.startNewGamePlus);
  const resetAll = useExperience((s) => s.resetAll);
  const playthroughs = useExperience((s) => s.playthroughs);

  return (
    <motion.section
      variants={stagger(0.18, 0.3)}
      initial="hidden"
      animate="show"
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <motion.p variants={fadeUp} className="eyebrow !text-gold">
        {site.replay.eyebrow}
        {playthroughs > 0 && ` · ${playthroughs + 1}`}
      </motion.p>
      <motion.h1 variants={fadeUp} className="display max-w-3xl text-balance text-5xl italic sm:text-7xl">
        {site.replay.title}
      </motion.h1>
      <motion.p variants={fadeUp} className="max-w-md text-mist">
        {site.replay.body}
      </motion.p>
      <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={() => {
            startNewGamePlus();
            router.push("/universe");
          }}
        >
          {site.replay.keep}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetAll();
            router.push("/");
          }}
        >
          {site.replay.reset}
        </Button>
      </motion.div>
    </motion.section>
  );
}
