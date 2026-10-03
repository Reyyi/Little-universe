"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, Reorder } from "motion/react";
import { timelineEvents } from "@/data/timeline";
import type { TimelineEvent } from "@/data/types";
import { useExperience } from "@/store/experience";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useSound } from "@/hooks/use-sound";
import { Button } from "@/components/ui/button";
import { shuffle, cn } from "@/lib/utils";

const solution = [...timelineEvents].sort((a, b) => a.date.localeCompare(b.date)).map((e) => e.id);

function CardBody({ event, position, solved, correct }: { event: TimelineEvent; position: number; solved: boolean; correct?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className={cn("display w-10 text-3xl italic tabular-nums", correct === false ? "text-rose" : "text-paper/30")}>{position + 1}</span>
      {event.photo && (
        <div className="relative size-14 shrink-0 overflow-hidden">
          <Image src={event.photo.src} alt="" fill sizes="56px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl leading-tight">{event.title}</p>
        {solved && <p className="eyebrow mt-1 !text-gold">{event.date}</p>}
      </div>
    </div>
  );
}

/**
 * Desktop: drag cards vertically (Motion Reorder).
 * Mobile: tap one card, then tap another to swap them.
 * Everywhere: ↑ / ↓ buttons for keyboard and assistive tech.
 */
export function TimelineGame() {
  const solvedBefore = useExperience((s) => s.completedGames.includes("timeline"));
  const completeGame = useExperience((s) => s.completeGame);
  const desktop = useIsDesktop();
  const play = useSound();
  const initial = useMemo(() => (solvedBefore ? solution : shuffle(timelineEvents.map((e) => e.id), 11)), [solvedBefore]);
  const [order, setOrder] = useState<string[]>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(solvedBefore);
  const byId = useMemo(() => Object.fromEntries(timelineEvents.map((e) => [e.id, e])), []);

  const update = (next: string[]) => {
    setOrder(next);
    setChecked(false);
  };
  const move = (id: string, dir: -1 | 1) => {
    const i = order.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const tap = (id: string) => {
    if (desktop || solved) return;
    if (!selected) return setSelected(id);
    if (selected === id) return setSelected(null);
    const next = [...order];
    const a = next.indexOf(selected);
    const b = next.indexOf(id);
    [next[a], next[b]] = [next[b], next[a]];
    setSelected(null);
    update(next);
  };
  const check = () => {
    setChecked(true);
    const ok = order.every((id, i) => id === solution[i]);
    if (ok) {
      setSolved(true);
      completeGame("timeline");
      play("chime", 0.5);
    } else play("soft", 0.3);
  };

  const controls = (id: string, i: number) =>
    !solved && (
      <div className="flex shrink-0 flex-col">
        <button type="button" onClick={() => move(id, -1)} disabled={i === 0} aria-label={`Move ${byId[id].title} earlier`} className="flex size-11 items-center justify-center text-mist hover:text-paper disabled:opacity-20">
          ↑
        </button>
        <button type="button" onClick={() => move(id, 1)} disabled={i === order.length - 1} aria-label={`Move ${byId[id].title} later`} className="flex size-11 items-center justify-center text-mist hover:text-paper disabled:opacity-20">
          ↓
        </button>
      </div>
    );

  const cardClass = (id: string, i: number) =>
    cn(
      "flex items-center gap-3 border bg-ink-900 py-3 pl-5 pr-2 transition-colors duration-500",
      solved ? "border-gold/40" : "border-paper/10",
      selected === id && "border-blush",
      checked && !solved && id !== solution[i] && "border-rose/40",
    );

  return (
    <section className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center px-5 py-28">
      <p className="eyebrow text-center">Game II</p>
      <h1 className="display mt-4 text-center text-6xl italic sm:text-7xl">Timeline</h1>
      <p className="mx-auto mt-4 max-w-sm text-center text-sm text-mist" id="timeline-help">
        {solved
          ? "Exactly how it happened."
          : desktop
            ? "Drag the moments into the order they happened — earliest at the top."
            : "Tap a moment, then tap another to swap them. Earliest at the top."}
      </p>

      {desktop ? (
        <Reorder.Group axis="y" values={order} onReorder={update} className="mt-12 flex flex-col gap-3" aria-describedby="timeline-help">
          {order.map((id, i) => (
            <Reorder.Item key={id} value={id} dragListener={!solved} className={cn(cardClass(id, i), !solved && "cursor-grab active:cursor-grabbing")} whileDrag={{ scale: 1.02, boxShadow: "0 30px 50px -20px rgba(0,0,0,0.9)" }}>
              <div className="flex-1">
                <CardBody event={byId[id]} position={i} solved={solved} correct={checked && !solved ? id === solution[i] : undefined} />
              </div>
              {controls(id, i)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <motion.ol layout className="mt-10 flex flex-col gap-3" aria-describedby="timeline-help">
          {order.map((id, i) => (
            <motion.li layout key={id} transition={{ duration: 0.5 }} className={cardClass(id, i)}>
              <button type="button" onClick={() => tap(id)} aria-pressed={selected === id} className="min-h-14 flex-1 text-left">
                <CardBody event={byId[id]} position={i} solved={solved} correct={checked && !solved ? id === solution[i] : undefined} />
              </button>
              {controls(id, i)}
            </motion.li>
          ))}
        </motion.ol>
      )}

      <div className="mt-10 flex flex-col items-center gap-4" aria-live="polite">
        {solved ? (
          <>
            <p className="font-hand text-3xl text-gold">Every moment in its place.</p>
            <Button asChild>
              <Link href="/game">Back to the games</Link>
            </Button>
          </>
        ) : (
          <>
            {checked && <p className="font-hand text-2xl text-blush">Almost — a couple have wandered. Try again?</p>}
            <Button onClick={check}>Check the order</Button>
          </>
        )}
      </div>
    </section>
  );
}
