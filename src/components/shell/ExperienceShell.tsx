"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { useExperience } from "@/store/experience";
import { metaForPath } from "@/data/chapters";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SmoothScroll } from "./SmoothScroll";
import { AmbientBackground } from "./AmbientBackground";
import { Grain } from "./Grain";
import { CursorEffect } from "./CursorEffect";
import { ChapterHUD } from "./ChapterHUD";
import { SecretLayer } from "@/components/secrets/SecretLayer";
import { AmbientAudio } from "./AmbientAudio";

export function ExperienceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const visitChapter = useExperience((s) => s.visitChapter);
  const setCurrentChapter = useExperience((s) => s.setCurrentChapter);
  const hydrated = useExperience((s) => s.hasHydrated);

  useEffect(() => {
    void useExperience.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  useEffect(() => {
    if (!hydrated) return;
    const meta = metaForPath(pathname);
    if (meta?.chapter) visitChapter(meta.chapter);
    else setCurrentChapter(null);
  }, [pathname, hydrated, visitChapter, setCurrentChapter]);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <SmoothScroll enabled={!reduced}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink-900 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <AmbientBackground />
        <ChapterHUD />
        <AmbientAudio />
        <main id="main" className="relative z-10 min-h-svh">
          {children}
          <SecretLayer />
        </main>
        <Grain />
        <CursorEffect />
      </SmoothScroll>
    </MotionConfig>
  );
}
