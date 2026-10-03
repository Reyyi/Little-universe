"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { LittleThing } from "@/data/types";
import { pad2, cn } from "@/lib/utils";

interface MemoryCardProps {
  item: LittleThing;
  index: number;
  collected: boolean;
  onCollect: () => void;
  onPlayAudio: (src: string) => void;
}

/** A physical, two-sided card. Front: an unopened index card. Back: the memory. */
export function MemoryCard({ item, index, collected, onCollect, onPlayAudio }: MemoryCardProps) {
  const tilt = ((index * 37) % 7) - 3;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="[perspective:1200px]"
      style={{ rotate: `${tilt * 0.6}deg` }}
    >
      <div className="relative aspect-[3/4] w-full">
        <motion.div
          className="relative size-full [transform-style:preserve-3d]"
          animate={{ rotateY: collected ? 180 : 0 }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* front */}
          <button
            type="button"
            onClick={onCollect}
            disabled={collected}
            aria-label={`Little thing number ${index + 1}. Turn the card over`}
            className="group absolute inset-0 flex flex-col justify-between border border-paper/10 bg-ink-800 p-5 text-left shadow-[0_24px_40px_-24px_rgba(0,0,0,0.9)] transition-colors duration-500 [backface-visibility:hidden] hover:border-gold/40"
          >
            <span className="eyebrow">No. {pad2(index + 1)}</span>
            <span aria-hidden className="display self-center text-7xl italic text-paper/10 transition-colors duration-700 group-hover:text-gold/40">
              {pad2(index + 1)}
            </span>
            <span className="eyebrow !text-[0.6rem]">Turn over</span>
          </button>
          {/* back */}
          <article
            aria-hidden={!collected}
            className="paper-surface absolute inset-0 flex flex-col overflow-hidden p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <span className="font-sans text-[0.6rem] uppercase tracking-[0.3em] text-[#7a6670]">No. {pad2(index + 1)}</span>
            {item.photo && (
              <div className="relative mt-3 aspect-[4/3] w-full overflow-hidden">
                <Image src={item.photo.src} alt={item.photo.alt} fill sizes="(min-width:768px) 20vw, 80vw" className="object-cover sepia-[0.2]" />
              </div>
            )}
            <h3 className={cn("font-display text-2xl leading-tight text-[#2a2228]", item.photo ? "mt-3" : "mt-auto")}>{item.title}</h3>
            <p className="mt-2 font-display text-base italic leading-snug text-[#5a4a52]">{item.description}</p>
            {item.audio && collected && (
              <button
                type="button"
                onClick={() => onPlayAudio(item.audio!)}
                className="mt-auto min-h-11 self-start font-sans text-[0.6rem] uppercase tracking-[0.3em] text-[#8e4f5d] underline-offset-4 hover:underline"
              >
                ▸ Listen
              </button>
            )}
          </article>
        </motion.div>
      </div>
    </motion.li>
  );
}
