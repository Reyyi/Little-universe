"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { chapterById } from "@/data/chapters";
import { secretRoom, secrets } from "@/data/secrets";
import { useExperience } from "@/store/experience";
import { chapterState } from "@/lib/progress";
import { gsap } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSound } from "@/hooks/use-sound";
import { pad2 } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { VoicePlayer } from "@/components/letter/VoicePlayer";

function Locked() {
  const found = useExperience((s) => s.discoveredSecrets.length);
  const gameDone = useExperience((s) => s.completedChapters.includes("game"));
  const need = chapterById.secrets.unlock.minSecrets ?? 0;
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">{secretRoom.eyebrow}</p>
      <h1 className="display text-6xl italic sm:text-8xl">{secretRoom.lockedTitle}</h1>
      <p className="max-w-sm text-mist">{secretRoom.lockedBody}</p>
      <ul className="eyebrow mt-4 space-y-2">
        <li className={found >= need ? "!text-gold" : ""}>
          Hidden stars · {pad2(Math.min(found, need))} / {pad2(need)}
        </li>
        <li className={gameDone ? "!text-gold" : ""}>The Game · {gameDone ? "complete" : "not yet"}</li>
      </ul>
      <Button asChild className="mt-6">
        <Link href="/universe">Keep exploring</Link>
      </Button>
    </section>
  );
}

/**
 * Dramatic entrance: a pinprick of light opens into the room (clip-path aperture),
 * then minimal content — photo, paragraph, voice note, optional video.
 */
export function SecretRoom() {
  const progress = useExperience();
  const completeChapter = useExperience((s) => s.completeChapter);
  const reduced = useReducedMotion();
  const play = useSound();
  const aperture = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const unlocked = progress.hasHydrated && chapterState(chapterById.secrets, progress) !== "secret";

  useEffect(() => {
    if (!unlocked || !aperture.current) return;
    play("discover", 0.4);
    completeChapter("secrets");
    if (reduced) {
      setRevealed(true);
      return;
    }
    const tl = gsap
      .timeline({ onComplete: () => setRevealed(true) })
      .fromTo(aperture.current, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(0.6% at 50% 50%)", duration: 1.2, ease: "power2.out" })
      .to(aperture.current, { clipPath: "circle(0.6% at 50% 50%)", duration: 0.8 })
      .to(aperture.current, { clipPath: "circle(150% at 50% 50%)", duration: 2.4, ease: "expo.inOut" });
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  if (!progress.hasHydrated) return <LoadingScreen />;
  if (!unlocked) return <Locked />;

  return (
    <div ref={aperture} className="relative min-h-svh bg-ink-900" style={{ clipPath: reduced ? undefined : "circle(0% at 50% 50%)" }}>
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
        <motion.p initial={{ opacity: 0 }} animate={revealed ? { opacity: 1 } : {}} transition={{ duration: 1.2 }} className="eyebrow">
          {secretRoom.eyebrow} · {pad2(progress.discoveredSecrets.length)} / {pad2(secrets.length)} stars
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="display mt-6 text-6xl italic sm:text-8xl"
        >
          {secretRoom.title}
        </motion.h1>
        <motion.figure
          initial={{ opacity: 0, scale: 0.96 }}
          animate={revealed ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, delay: 0.6 }}
          className="mt-16 w-full max-w-md rotate-[-1.5deg] bg-[#efe6da] p-3 pb-12 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image src={secretRoom.photo.src} alt={secretRoom.photo.alt} fill sizes="(min-width:768px) 28rem, 90vw" className="object-cover" />
          </div>
          <figcaption className="mt-4 font-hand text-2xl text-[#5a4650]">{secretRoom.caption}</figcaption>
        </motion.figure>
        <motion.p
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 2, delay: 1.4 }}
          className="mt-16 max-w-xl font-display text-2xl leading-relaxed text-paper/90 sm:text-3xl"
        >
          {secretRoom.paragraph}
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={revealed ? { opacity: 1 } : {}} transition={{ duration: 1.4, delay: 2 }} className="mt-16 flex w-full justify-center text-left">
          <VoicePlayer src={secretRoom.voiceNote.src} title={secretRoom.voiceNote.title} />
        </motion.div>
        {secretRoom.video && (
          <video controls preload="none" poster={secretRoom.video.poster} className="mt-16 w-full max-w-2xl" src={secretRoom.video.src} />
        )}
        <Button asChild className="mt-20">
          <Link href="/letter">Now, the letter</Link>
        </Button>
      </section>
    </div>
  );
}
