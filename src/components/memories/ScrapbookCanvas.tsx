"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { galleryMemories } from "@/data/memories";
import type { GalleryMemory } from "@/data/types";
import { gsap, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DistortImage } from "./DistortImage";

/** Desktop: irregular, rotated composition with depth-based parallax. */
export function ScrapbookCanvas({ onOpen, openId }: { onOpen: (m: GalleryMemory) => void; openId: string | null }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        const depth = Number(el.dataset.depth);
        gsap.fromTo(
          el,
          { y: 160 * depth },
          { y: -160 * depth, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="relative mx-auto h-[190vh] max-w-7xl px-8">
      {galleryMemories.map((m, i) => (
        <div
          key={m.id}
          data-depth={m.layout.depth}
          className="absolute"
          style={{ left: `${m.layout.x}%`, top: `${m.layout.y}%`, width: `${m.layout.w}%` }}
        >
          <motion.button
            type="button"
            onClick={() => onOpen(m)}
            onPointerEnter={() => setActive(m.id)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(m.id)}
            onBlur={() => setActive(null)}
            aria-label={`Open memory: ${m.title}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: (i % 3) * 0.1 }}
            style={{ rotate: m.layout.rotate }}
            className="group block w-full bg-[#efe6da] p-3 pb-12 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.95)]"
          >
            <motion.div layoutId={`memory-${m.id}`} className="relative aspect-[4/5] w-full bg-ink-800" style={{ opacity: openId === m.id ? 0 : 1 }}>
              <DistortImage media={m.photo} sizes="30vw" active={active === m.id} />
            </motion.div>
            <span className="absolute bottom-3 left-4 font-hand text-xl text-[#5a4650]">{m.title}</span>
            <span className="absolute bottom-4 right-4 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-[#8a7880]">{m.date}</span>
            {i % 3 === 0 && (
              <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-blush/40 mix-blend-multiply" />
            )}
          </motion.button>
        </div>
      ))}
    </div>
  );
}
