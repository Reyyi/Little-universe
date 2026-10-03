"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { secrets } from "@/data/secrets";
import type { Secret } from "@/data/types";
import { useExperience } from "@/store/experience";
import { useSound } from "@/hooks/use-sound";
import { pad2 } from "@/lib/utils";
import { HiddenStar } from "./HiddenStar";

/**
 * Renders the hidden stars that belong to the current route, positioned in
 * % of the page. Placement lives in data/secrets.ts — pages stay untouched.
 */
export function SecretLayer() {
  const pathname = usePathname();
  const hydrated = useExperience((s) => s.hasHydrated);
  const found = useExperience((s) => s.discoveredSecrets);
  const discover = useExperience((s) => s.discoverSecret);
  const play = useSound();
  const [whisper, setWhisper] = useState<Secret | null>(null);

  useEffect(() => {
    if (!whisper) return;
    const id = window.setTimeout(() => setWhisper(null), 4200);
    return () => window.clearTimeout(id);
  }, [whisper]);

  if (!hydrated) return null;
  const here = secrets.filter((s) => s.route === pathname);

  const onFind = (s: Secret) => {
    discover(s.id);
    play("discover", 0.5);
    setWhisper(s);
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {here.map((s) => (
          <HiddenStar
            key={s.id}
            secret={s}
            found={found.includes(s.id)}
            onFind={onFind}
            className="pointer-events-auto"
            style={{ left: `${s.position.x}%`, top: `${s.position.y}%` }}
          />
        ))}
      </div>
      <AnimatePresence>
        {whisper && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8 }}
            className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[75] w-[min(92vw,26rem)] -translate-x-1/2 border border-gold/30 bg-ink-900/95 px-6 py-4 text-center"
          >
            <p className="eyebrow !text-gold">
              Hidden star {pad2(found.length)} / {pad2(secrets.length)}
            </p>
            <p className="mt-2 font-display text-xl italic">{whisper.reward}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
