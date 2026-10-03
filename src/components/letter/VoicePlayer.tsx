"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Howl } from "howler";
import { createHowl, duckAmbient } from "@/lib/audio";
import { formatTime, cn } from "@/lib/utils";

interface VoicePlayerProps {
  src: string;
  title: string;
  onFirstPlay?: () => void;
  className?: string;
}

/** Howler-backed player. Never autoplays; the file is fetched on first press. */
export function VoicePlayer({ src, title, onFirstPlay, className }: VoicePlayerProps) {
  const howl = useRef<Howl | null>(null);
  const raf = useRef(0);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);

  const tick = useCallback(() => {
    const h = howl.current;
    if (!h) return;
    setPos(h.seek() as number);
    if (h.playing()) raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      howl.current?.unload();
      duckAmbient(false);
    },
    [],
  );

  const ensure = async () => {
    if (howl.current) return howl.current;
    setState("loading");
    const h = await createHowl({
      src: [src],
      html5: true,
      onload: () => setDur(h.duration()),
      onplay: () => {
        setState("playing");
        duckAmbient(true);
        raf.current = requestAnimationFrame(tick);
      },
      onpause: () => {
        setState("paused");
        duckAmbient(false);
      },
      onend: () => {
        setState("paused");
        setPos(0);
        duckAmbient(false);
      },
    });
    howl.current = h;
    return h;
  };

  const toggle = async () => {
    const h = await ensure();
    if (h.playing()) h.pause();
    else {
      h.play();
      onFirstPlay?.();
    }
  };

  const restart = async () => {
    const h = await ensure();
    h.seek(0);
    setPos(0);
    if (!h.playing()) {
      h.play();
      onFirstPlay?.();
    }
  };

  const seek = (value: number) => {
    setPos(value);
    howl.current?.seek(value);
  };

  const playing = state === "playing";

  return (
    <div className={cn("flex w-full max-w-md flex-col gap-4", className)} role="group" aria-label={`Audio: ${title}`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : state === "paused" ? "Resume" : "Play"}
          className="flex size-14 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:border-gold hover:text-gold"
        >
          {state === "loading" ? (
            <span className="size-1.5 animate-breathe rounded-full bg-current" />
          ) : playing ? (
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path fill="currentColor" d="M7 5h3v14H7zM14 5h3v14h-3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 size-4" aria-hidden>
              <path fill="currentColor" d="M7 4l13 8-13 8z" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <p className="font-display text-lg italic">{title}</p>
          <input
            type="range"
            min={0}
            max={dur || 1}
            step={0.1}
            value={Math.min(pos, dur || 1)}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!dur}
            aria-label="Seek"
            aria-valuetext={`${formatTime(pos)} of ${formatTime(dur)}`}
            className="mt-2 h-11 w-full cursor-pointer accent-gold disabled:opacity-30"
          />
          <div className="flex justify-between text-xs tabular-nums text-mist">
            <span>{formatTime(pos)}</span>
            <span>{formatTime(dur)}</span>
          </div>
        </div>
      </div>
      <button type="button" onClick={restart} className="eyebrow min-h-11 self-start hover:!text-paper">
        ↺ Restart
      </button>
    </div>
  );
}
