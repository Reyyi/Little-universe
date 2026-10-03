"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { chapterById } from "@/data/chapters";
import type { ChapterId } from "@/data/types";
import { useExperience } from "@/store/experience";
import { chapterState } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

/** Gently stops visitors from skipping ahead via URL; renders children once unlocked. */
export function ChapterGate({ id, children, locked }: { id: ChapterId; children: ReactNode; locked?: ReactNode }) {
  const progress = useExperience();
  if (!progress.hasHydrated) return <LoadingScreen />;
  const state = chapterState(chapterById[id], progress);
  if (state !== "locked" && state !== "secret") return <>{children}</>;
  if (locked) return <>{locked}</>;
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">Chapter {String(chapterById[id].number).padStart(2, "0")}</p>
      <h1 className="display text-5xl sm:text-7xl">Not quite yet.</h1>
      <p className="max-w-sm text-mist">This part of the story opens a little later. Follow the stars in order.</p>
      <Button asChild className="mt-4">
        <Link href="/universe">Back to the universe</Link>
      </Button>
    </section>
  );
}
