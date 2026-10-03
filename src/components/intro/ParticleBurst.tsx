"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "@/lib/animation";

export interface ParticleBurstHandle {
  burst: (origin?: { x: number; y: number }) => Promise<void>;
}

const COUNT = 48;

/** Golden dust that scatters outward — used for scene changes. */
export const ParticleBurst = forwardRef<ParticleBurstHandle>(function ParticleBurst(_, ref) {
  const root = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    burst: (origin) =>
      new Promise<void>((resolve) => {
        const el = root.current;
        if (!el) return resolve();
        const dots = Array.from(el.children) as HTMLElement[];
        const ox = origin?.x ?? window.innerWidth / 2;
        const oy = origin?.y ?? window.innerHeight / 2;
        gsap.set(dots, { x: ox, y: oy, opacity: 0, scale: 0.4 });
        const tl = gsap.timeline({ onComplete: () => resolve() });
        dots.forEach((d, i) => {
          const a = (i / dots.length) * Math.PI * 2 + Math.random() * 0.4;
          const r = 120 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * 0.45;
          tl.to(
            d,
            {
              x: ox + Math.cos(a) * r,
              y: oy + Math.sin(a) * r - 40,
              opacity: 0,
              scale: 0.6 + Math.random(),
              duration: 1.6 + Math.random() * 0.8,
              ease: "expo.out",
              keyframes: { opacity: [0, 1, 0.8, 0] },
            },
            0,
          );
        });
      }),
  }));

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[85]">
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 size-1 rounded-full bg-gold opacity-0 shadow-[0_0_10px_2px_rgba(200,173,125,0.6)]"
        />
      ))}
    </div>
  );
});
