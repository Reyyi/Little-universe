"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ChapterId } from "@/data/types";
import { chapters } from "@/data/chapters";
import { useExperience } from "@/store/experience";
import { Button } from "@/components/ui/button";

/**
 * Closing frame of a chapter. Marks the chapter complete once it scrolls into
 * view and offers the next door.
 */
export function ChapterEnd({ id, line, complete = true }: { id: ChapterId; line: string; complete?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const completeChapter = useExperience((s) => s.completeChapter);
  const idx = chapters.findIndex((c) => c.id === id);
  const next = chapters.slice(idx + 1).find((c) => c.kind === "chapter");

  useEffect(() => {
    if (!complete || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && completeChapter(id), { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [complete, completeChapter, id]);

  return (
    <section ref={ref} className="flex min-h-[70svh] flex-col items-center justify-center gap-8 px-6 text-center">
      <span aria-hidden className="h-16 w-px bg-gradient-to-b from-transparent to-gold/60" />
      <p className="display max-w-xl text-3xl italic text-mist sm:text-4xl">{line}</p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {next && complete && (
          <Button asChild>
            <Link href={next.route}>Next — {next.title}</Link>
          </Button>
        )}
        <Button asChild variant="ghost">
          <Link href="/universe">Back to the universe</Link>
        </Button>
      </div>
    </section>
  );
}
