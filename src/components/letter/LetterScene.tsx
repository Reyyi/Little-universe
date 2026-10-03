"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/data/site";
import { useExperience } from "@/store/experience";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { LetterPaper } from "./LetterPaper";
import { VoicePlayer } from "./VoicePlayer";

/**
 * The emotional climax. Nearly all chrome is gone (HUD is immersive here).
 * Sequence: paper rises → lines fade in slowly, one after another → three quiet controls.
 * Then the voice letter scene, then fade to black → /ending.
 */
export function LetterScene() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const setLetterOpened = useExperience((s) => s.setLetterOpened);
  const setVoicePlayed = useExperience((s) => s.setVoiceLetterPlayed);
  const completeChapter = useExperience((s) => s.completeChapter);
  const root = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [scene, setScene] = useState<"letter" | "voice" | "leaving">("letter");
  const [read, setRead] = useState(false);

  useEffect(() => setLetterOpened(true), [setLetterOpened]);

  useGSAP(
    () => {
      if (scene !== "letter" || !paper.current) return;
      const lines = paper.current.querySelectorAll("[data-line]");
      if (reduced) {
        gsap.set([paper.current, lines], { opacity: 1, y: 0 });
        setRead(true);
        return;
      }
      tl.current = gsap
        .timeline({ onComplete: () => setRead(true) })
        .fromTo(paper.current, { opacity: 0, y: 80, rotate: -1.5 }, { opacity: 1, y: 0, rotate: -0.4, duration: 2.6, ease: "power3.out" })
        .fromTo(lines, { opacity: 0, y: 12, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 2.2, stagger: 1.6, ease: "power2.out" }, "-=1");
    },
    { scope: root, dependencies: [scene, reduced] },
  );

  const replay = () => {
    setRead(false);
    tl.current?.restart();
  };

  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.();
  };

  const finish = () => {
    completeChapter("letter");
    setScene("leaving");
    window.setTimeout(() => router.push("/ending"), reduced ? 0 : 1600);
  };

  return (
    <div ref={root} className="relative min-h-svh overflow-y-auto bg-ink-950">
      <AnimatePresence mode="wait">
        {scene === "letter" && (
          <motion.section key="letter" exit={{ opacity: 0, transition: { duration: 1.2 } }} className="px-4 pb-40 pt-28 sm:pt-32">
            <h1 className="sr-only">The letter</h1>
            <LetterPaper ref={paper} />
            <nav aria-label="Letter controls" className="fixed inset-x-0 bottom-0 z-40 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 sm:gap-6">
              <Button variant="ghost" size="sm" onClick={() => setScene("voice")}>
                ▸ Listen
              </Button>
              <Button variant="ghost" size="sm" onClick={fullscreen}>
                ⤢ Fullscreen
              </Button>
              <Button variant="ghost" size="sm" onClick={replay}>
                ↺ Replay
              </Button>
              <AnimatePresence>
                {read && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
                    <Button size="sm" onClick={() => setScene("voice")}>
                      One more thing
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>
          </motion.section>
        )}
        {scene === "voice" && (
          <motion.section
            key="voice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1.6 } }}
            exit={{ opacity: 0, transition: { duration: 1.4 } }}
            className="flex min-h-svh flex-col items-center justify-center gap-10 px-6 text-center"
          >
            <p className="eyebrow">{site.voiceLetter.eyebrow}</p>
            <h1 className="display max-w-2xl text-balance text-5xl italic sm:text-7xl">{site.voiceLetter.title}</h1>
            <p className="max-w-sm text-sm text-mist">{site.voiceLetter.note}</p>
            <VoicePlayer src={site.voiceLetter.src} title="Voice letter" onFirstPlay={() => setVoicePlayed(true)} className="text-left" />
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button variant="ghost" onClick={() => setScene("letter")}>
                Read the letter again
              </Button>
              <Button onClick={finish}>{site.voiceLetter.cta}</Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
