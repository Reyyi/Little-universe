"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Soft warm light that follows the pointer (or drifts slowly on touch). */
export function PointerLight({ intensity = 0.16 }: { intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = { x: 0.5, y: 0.45 };
    const pos = { ...target };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const loop = (t: number) => {
      if (!matchMedia("(hover: hover)").matches && !reduced) {
        target.x = 0.5 + Math.sin(t / 3200) * 0.18;
        target.y = 0.45 + Math.cos(t / 4100) * 0.12;
      }
      pos.x += (target.x - pos.x) * (reduced ? 1 : 0.05);
      pos.y += (target.y - pos.y) * (reduced ? 1 : 0.05);
      el.style.background = `radial-gradient(38rem 38rem at ${pos.x * 100}% ${pos.y * 100}%, rgba(235,207,213,${intensity}), rgba(200,173,125,${intensity * 0.25}) 35%, transparent 70%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [intensity, reduced]);

  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />;
}
