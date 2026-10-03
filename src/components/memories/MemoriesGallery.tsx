"use client";

import { useCallback, useState } from "react";
import { LayoutGroup } from "motion/react";
import type { GalleryMemory } from "@/data/types";
import { useIsDesktop } from "@/hooks/use-media-query";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { ChapterEnd } from "@/components/shell/ChapterEnd";
import { ScrapbookCanvas } from "./ScrapbookCanvas";
import { SwipeGallery } from "./SwipeGallery";
import { MemoryLightbox } from "./MemoryLightbox";

/**
 * Hierarchy: title → scattered polaroids → opened memory.
 * Desktop: asymmetric scrapbook with parallax + hover distortion.
 * Mobile: horizontal swipe gallery. Both open the same shared-element lightbox.
 */
export function MemoriesGallery() {
  const desktop = useIsDesktop();
  const [open, setOpen] = useState<GalleryMemory | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <LayoutGroup>
      <ChapterHeader eyebrow="Chapter 03" title="Memories">
        <p className="max-w-md">A scrapbook with the pages slightly out of order. Open any of them.</p>
      </ChapterHeader>
      {desktop ? <ScrapbookCanvas onOpen={setOpen} openId={open?.id ?? null} /> : <SwipeGallery onOpen={setOpen} openId={open?.id ?? null} />}
      <ChapterEnd id="memories" line="I keep these somewhere safe. Now you know where." />
      <MemoryLightbox memory={open} onClose={close} />
    </LayoutGroup>
  );
}
