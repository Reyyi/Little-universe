"use client";

import { forwardRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { site } from "@/data/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface EnvelopeProps {
  onOpen: () => void;
  disabled: boolean;
}

/**
 * Layers (back → front): back panel, letter, front pocket, flap, wax seal.
 * Opening choreography is driven by the parent through data-part selectors.
 */
export const Envelope = forwardRef<HTMLDivElement, EnvelopeProps>(function Envelope({ onOpen, disabled }, ref) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const rotY = useSpring(useTransform(px, [0, 1], [-10, 10]), spring);
  const rotX = useSpring(useTransform(py, [0, 1], [8, -8]), spring);
  const lx = useTransform(px, (v) => `${v * 100}%`);
  const ly = useTransform(py, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(22rem 22rem at ${lx} ${ly}, rgba(255,255,255,0.28), transparent 60%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="[perspective:1400px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        ref={ref}
        data-part="envelope"
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.55] w-[min(86vw,30rem)]"
      >
        {/* back */}
        <div className="absolute inset-0 rounded-[3px] bg-[#d8ccbb] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" />
        {/* letter */}
        <div
          data-part="letter"
          className="paper-surface absolute inset-x-[6%] top-[6%] h-[88%] rounded-[2px] px-[8%] py-[7%] shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
        >
          <p className="font-hand text-2xl text-[#5a4650] sm:text-3xl">{site.recipient},</p>
          <p className="mt-3 font-display text-lg italic leading-snug text-[#3a2f35] sm:text-xl">{site.envelope.letterPreview}</p>
          <div aria-hidden className="mt-4 space-y-2.5">
            {[90, 75, 82].map((w) => (
              <div key={w} className="h-px bg-[#3a2f35]/15" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        {/* front pocket */}
        <div
          data-part="pocket"
          className="absolute inset-0 rounded-[3px] bg-[#e7ddcf]"
          style={{ clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,transparent_40%,rgba(120,90,70,0.12))]" />
          <p className="absolute bottom-[12%] left-0 right-0 px-8 text-center font-display text-sm italic text-[#6b5a60] sm:text-base">
            {site.envelope.addressedTo}
          </p>
        </div>
        {/* flap */}
        <div
          data-part="flap"
          className="absolute inset-x-0 top-0 h-[58%] origin-top [backface-visibility:visible]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 bg-[#ddd1c1] shadow-[0_6px_14px_rgba(0,0,0,0.12)]"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 94%)" }}
          />
        </div>
        {/* light */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[3px] mix-blend-soft-light" style={{ background: sheen }} />
        {/* wax seal */}
        <button
          type="button"
          data-part="seal"
          onClick={onOpen}
          disabled={disabled}
          aria-label={site.envelope.openLabel}
          className="group absolute left-1/2 top-[54%] z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c98b98,#8e4f5d_70%)] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.35),0_6px_14px_rgba(60,20,30,0.45)] transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-2 rounded-full border border-[#f3d3da]/30" />
          <span className="font-hand text-lg text-[#f7e2e7]">{site.envelope.seal}</span>
        </button>
      </motion.div>
    </div>
  );
});
