"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/data/site";
import { useExperience } from "@/store/experience";
import { gsap } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { CinematicLines } from "@/components/ui/CinematicLines";
import { PointerLight } from "@/components/intro/PointerLight";
import { Envelope } from "./Envelope";

type Stage = "closed" | "opening" | "welcome";

/**
 * Hierarchy: envelope is the only object; seal is the only control.
 * Sequence: seal lifts → flap opens → letter slides out → scene dissolves → "Wait..." lines → BEGIN.
 * Mobile: no tilt, same sequence. Reduced motion: short fades instead of the 3D opening.
 */
export function EnvelopeScene() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const play = useSound();
  const setEnvelopeOpened = useExperience((s) => s.setEnvelopeOpened);
  const [stage, setStage] = useState<Stage>("closed");
  const [ctaReady, setCtaReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const onLinesDone = useCallback(() => setCtaReady(true), []);

  const open = () => {
    if (stage !== "closed" || !stageRef.current) return;
    setStage("opening");
    play("paper", 0.6);
    const q = gsap.utils.selector(stageRef.current);
    const done = () => setStage("welcome");
    if (reduced) {
      gsap.to(stageRef.current, { opacity: 0, duration: 0.4, onComplete: done });
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to(q("[data-part=seal]"), { scale: 1.15, duration: 0.25, ease: "power2.out" })
      .to(q("[data-part=seal]"), { scale: 0.6, opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
      .to(q("[data-part=flap]"), { rotateX: 178, duration: 1.1, ease: "power3.inOut" }, "-=0.1")
      .set(q("[data-part=flap]"), { zIndex: 0 })
      .set(q("[data-part=letter]"), { zIndex: 1 })
      .set(q("[data-part=pocket]"), { zIndex: 2 })
      .to(q("[data-part=letter]"), { yPercent: -62, duration: 1.6, ease: "power2.inOut" }, "+=0.1")
      .to(q("[data-part=envelope]"), { y: 60, duration: 1.6, ease: "power2.inOut" }, "<")
      .to(stageRef.current, { opacity: 0, scale: 1.06, filter: "blur(8px)", duration: 1.4, ease: "power2.in" }, "+=1.2");
  };

  const begin = () => {
    setEnvelopeOpened(true);
    router.push("/universe");
  };

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-6">
      <PointerLight intensity={0.1} />
      <h1 className="sr-only">An envelope, addressed to {site.recipient}</h1>
      <AnimatePresence mode="wait">
        {stage !== "welcome" ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="flex flex-col items-center gap-12"
          >
            <div ref={stageRef}>
              <Envelope onOpen={open} disabled={stage !== "closed"} />
            </div>
            <motion.p
              animate={{ opacity: stage === "closed" ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow"
              aria-hidden={stage !== "closed"}
            >
              Tap the seal to open
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-16">
            <CinematicLines lines={site.envelope.afterLines} hold={2000} onComplete={onLinesDone} />
            <div className="min-h-14">
              {ctaReady && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
                  <Button size="lg" onClick={begin} autoFocus>
                    {site.envelope.cta}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

