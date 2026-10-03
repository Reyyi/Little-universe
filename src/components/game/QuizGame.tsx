"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { questions } from "@/data/questions";
import { useExperience } from "@/store/experience";
import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { pad2, cn } from "@/lib/utils";

/**
 * One question per scene. Answering never blocks: a correct answer rings a chime
 * and glows gold; a wrong one softly dims and reveals the right answer kindly.
 */
export function QuizGame() {
  const answers = useExperience((s) => s.quizAnswers);
  const answer = useExperience((s) => s.answerQuestion);
  const completeGame = useExperience((s) => s.completeGame);
  const play = useSound();
  const firstOpen = questions.findIndex((q) => !answers[q.id]);
  const [index, setIndex] = useState(firstOpen === -1 ? questions.length : firstOpen);
  const q = questions[index];
  const picked = q ? answers[q.id] : undefined;
  const score = questions.filter((x) => answers[x.id]?.correct).length;
  const finished = index >= questions.length;

  useEffect(() => {
    if (finished) completeGame("quiz");
  }, [finished, completeGame]);

  const choose = (choice: number) => {
    if (!q || picked) return;
    const correct = choice === q.answer;
    answer(q.id, { choice, correct });
    play(correct ? "chime" : "soft", correct ? 0.5 : 0.35);
  };

  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 py-28">
      <AnimatePresence mode="wait">
        {!finished && q ? (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl"
          >
            <p className="eyebrow text-center tabular-nums">
              Question {pad2(index + 1)} / {pad2(questions.length)}
            </p>
            <h1 className="display mt-6 text-balance text-center text-5xl italic sm:text-7xl">{q.prompt}</h1>
            <div role="group" aria-label="Answers" className="mt-14 grid gap-3 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const isPicked = picked?.choice === i;
                const isAnswer = i === q.answer;
                return (
                  <motion.button
                    key={opt}
                    type="button"
                    onClick={() => choose(i)}
                    disabled={!!picked}
                    aria-pressed={isPicked}
                    animate={isPicked && !picked?.correct ? { x: [0, -6, 6, -3, 0] } : { x: 0 }}
                    transition={{ duration: 0.6 }}
                    className={cn(
                      "group flex min-h-16 items-center gap-5 border px-6 py-4 text-left transition-[border-color,background-color,opacity] duration-700",
                      !picked && "border-paper/15 hover:border-paper/50 hover:bg-paper/[0.03]",
                      picked && isAnswer && "border-gold bg-gold/10",
                      picked && isPicked && !isAnswer && "border-rose/40 opacity-60",
                      picked && !isPicked && !isAnswer && "border-paper/5 opacity-30",
                    )}
                  >
                    <span className="eyebrow">{String.fromCharCode(65 + i)}</span>
                    <span className="font-display text-2xl">{opt}</span>
                    {picked && isAnswer && <span className="eyebrow ml-auto !text-gold">✦</span>}
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-10 flex min-h-28 flex-col items-center gap-6" aria-live="polite">
              {picked && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
                  <p className={cn("font-hand text-3xl", picked.correct ? "text-gold" : "text-blush")}>
                    {picked.correct ? q.correctNote : q.gentleNote}
                  </p>
                  <Button onClick={() => setIndex(index + 1)} autoFocus>
                    {index + 1 < questions.length ? "Next question" : "See how we did"}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="flex flex-col items-center text-center">
            <p className="eyebrow">The questions</p>
            <h1 className="display mt-6 text-6xl italic sm:text-8xl">
              {score} <span className="text-mist">of</span> {questions.length}
            </h1>
            <p className="mt-6 max-w-md font-hand text-3xl text-blush">
              {score === questions.length ? "Every single one. Of course." : "Honestly, you could have answered anything. You'd still win."}
            </p>
            <p className="eyebrow mt-10 !text-gold">Unlocked · a page in the scrapbook of us</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/game">Back to the games</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
