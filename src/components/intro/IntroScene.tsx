"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/data/site";
import { useExperience } from "@/store/experience";
import { startAmbient } from "@/lib/audio";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { CinematicLines } from "@/components/ui/CinematicLines";
import { PointerLight } from "./PointerLight";
import { ParticleBurst, type ParticleBurstHandle } from "./ParticleBurst";

/**
 * Hierarchy: one line of display type → a quieter second line → the ENTER CTA.
 * Interaction: pointer light only; ENTER is the single decision (with or without sound).
 * Mobile: same composition, light drifts on its own. Reduced motion: all lines at once.
 */
export function IntroScene() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const setAudioEnabled = useExperience((s) => s.setAudioEnabled);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const burst = useRef<ParticleBurstHandle>(null);
  const onComplete = useCallback(() => setReady(true), []);

  const enter = async (withSound: boolean, e: React.MouseEvent) => {
    if (leaving) return;
    setLeaving(true);
    setAudioEnabled(withSound);
    if (withSound) void startAmbient();
    router.prefetch("/enter");
    if (!reduced) await burst.current?.burst({ x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 });
    router.push("/enter");
  };

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      <PointerLight />
      <motion.div
        animate={leaving ? { opacity: 0, scale: 0.98, filter: "blur(6px)" } : { opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative flex flex-col items-center gap-16"
      >
        <h1 className="sr-only">{site.title}</h1>
        <CinematicLines lines={site.intro.lines} hold={2600} onComplete={onComplete} />
        <div className="flex min-h-28 flex-col items-center gap-4">
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-3"
              >
                <Button size="lg" onClick={(e) => enter(true, e)} aria-describedby="sound-note" autoFocus>
                  {site.intro.cta}
                </Button>
                <p id="sound-note" className="text-xs text-mist/70">
                  Best with sound.{" "}
                  <button type="button" onClick={(e) => enter(false, e)} className="min-h-11 underline decoration-paper/20 underline-offset-4 hover:text-paper">
                    Enter quietly
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <ParticleBurst ref={burst} />
    </section>
  );
}
