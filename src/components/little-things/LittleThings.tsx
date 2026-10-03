"use client";

import { littleThings } from "@/data/memories";
import { littleThingsGoal } from "@/data/chapters";
import { useExperience } from "@/store/experience";
import { useSound } from "@/hooks/use-sound";
import { pad2 } from "@/lib/utils";
import { ChapterHeader } from "@/components/ui/ChapterHeader";
import { ChapterEnd } from "@/components/shell/ChapterEnd";
import { MemoryCard } from "./MemoryCard";

/**
 * Hierarchy: title + live counter → a loose deck of numbered cards.
 * Interaction: tap/click/Enter turns a card and collects it (persisted).
 * Mobile: two columns, smaller tilt. The chapter completes at `littleThingsGoal` cards.
 */
export function LittleThings() {
  const collected = useExperience((s) => s.discoveredMemories);
  const collect = useExperience((s) => s.collectMemory);
  const play = useSound();
  const count = littleThings.filter((t) => collected.includes(t.id)).length;
  const done = count >= littleThingsGoal;

  return (
    <>
      <ChapterHeader eyebrow="Chapter 02" title="Little Things">
        <p className="max-w-md">Twenty small things I never want to forget. Turn them over, one at a time.</p>
        <p className="eyebrow mt-6 tabular-nums" aria-live="polite">
          <span className="!text-gold">{pad2(count)}</span> / {pad2(littleThings.length)} collected
        </p>
      </ChapterHeader>
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 pb-24 sm:gap-8 sm:px-8 md:grid-cols-4">
        {littleThings.map((item, i) => (
          <MemoryCard
            key={item.id}
            item={item}
            index={i}
            collected={collected.includes(item.id)}
            onCollect={() => {
              collect(item.id);
              play("paper", 0.35);
            }}
            onPlayAudio={(src) => play(src, 0.6)}
          />
        ))}
      </ul>
      <ChapterEnd
        id="little-things"
        complete={done}
        line={done ? "There are a hundred more. These were just the first that came to mind." : `Collect ${littleThingsGoal - count} more to continue.`}
      />
    </>
  );
}
