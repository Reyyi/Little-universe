"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { chapterById, metaForPath } from "@/data/chapters";
import { site } from "@/data/site";
import { useExperience } from "@/store/experience";
import { pad2, cn } from "@/lib/utils";
import { AudioControl } from "./AudioControl";
import { ProgressIndicator } from "./ProgressIndicator";
import { ChapterMenu } from "./ChapterMenu";

export function ChapterHUD() {
  const pathname = usePathname();
  const meta = metaForPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const newGamePlus = useExperience((s) => s.newGamePlus);
  const immersive = meta?.immersive ?? false;
  const chapter = meta?.chapter ? chapterById[meta.chapter] : undefined;
  const isIntro = pathname === "/" || pathname === "/enter";

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6",
        )}
      >
        <div className="pointer-events-auto flex items-center gap-4">
          <Link
            href={isIntro ? "/" : "/universe"}
            aria-label={isIntro ? site.title : "Back to the universe"}
            className={cn(
              "flex size-11 items-center justify-center rounded-full border border-paper/20 font-display text-xl italic text-paper transition-[opacity,border-color] duration-700 hover:border-gold",
              immersive && "opacity-40 hover:opacity-100",
            )}
          >
            {site.monogram}
            {newGamePlus && <span className="sr-only">New Game Plus</span>}
          </Link>
          {newGamePlus && !immersive && <span aria-hidden className="font-display text-gold">+</span>}
          <AnimatePresence mode="wait">
            {!immersive && meta && (
              <motion.div
                key={meta.path}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6 }}
                className="hidden flex-col sm:flex"
              >
                <span className="eyebrow">{chapter ? `Chapter ${pad2(chapter.number)}` : meta.label}</span>
                {chapter && <span className="font-display text-lg italic leading-tight text-paper">{meta.label}</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 sm:gap-6">
          {!immersive && <ProgressIndicator />}
          <AudioControl className={cn(immersive && "opacity-50 hover:opacity-100")} />
          {!isIntro && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className={cn(
                "flex min-h-11 items-center gap-2 px-2 text-mist transition-colors hover:text-paper",
                immersive && "opacity-50 hover:opacity-100",
              )}
            >
              <span aria-hidden className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-3 bg-current" />
              </span>
              <span className="eyebrow !text-current">{chapter ? pad2(chapter.number) : "Map"}</span>
              <span className="sr-only">Open chapter menu</span>
            </button>
          )}
        </div>
      </header>
      <ChapterMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
