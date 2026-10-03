"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { chapters } from "@/data/chapters";
import { site } from "@/data/site";
import { useExperience } from "@/store/experience";
import { chapterState, type NodeState } from "@/lib/progress";
import { supportsWebGL } from "@/lib/webgl";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ChapterList } from "./ChapterList";

const UniverseScene = dynamic(() => import("./UniverseScene"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

/**
 * Desktop: full-bleed 3D constellation with DOM buttons on every star.
 * Mobile: vertical list; the 3D map is opt-in so phones never pay for WebGL by default.
 */
export function UniverseView() {
  const progress = useExperience();
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [mobile3d, setMobile3d] = useState(false);

  useEffect(() => setWebgl(supportsWebGL()), []);

  const states = useMemo(
    () => Object.fromEntries(chapters.map((c) => [c.id, chapterState(c, progress)])) as Record<string, NodeState>,
    [progress],
  );

  if (!progress.hasHydrated) return <LoadingScreen />;
  const show3d = webgl && (desktop || mobile3d);

  return (
    <section className="relative min-h-svh">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className={
          show3d
            ? "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center"
            : "px-6 pb-10 pt-28 text-center"
        }
      >
        <p className="eyebrow">{site.universe.eyebrow}</p>
        <h1 className="display mt-3 text-5xl italic sm:text-6xl">{site.universe.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-mist">
          {progress.newGamePlus ? site.universe.newGamePlusNote : site.universe.hint}
        </p>
        {!desktop && webgl && (
          <button
            type="button"
            onClick={() => setMobile3d((v) => !v)}
            className="eyebrow pointer-events-auto mt-6 min-h-11 border-b hairline hover:!text-paper"
          >
            {mobile3d ? "Show as list" : "View as constellation"}
          </button>
        )}
      </motion.header>

      {show3d ? (
        <div className="fixed inset-0 z-0">
          <UniverseScene states={states} reduced={reduced} />
        </div>
      ) : (
        <div className="px-6 pb-24">
          <ChapterList states={states} />
        </div>
      )}
    </section>
  );
}
