"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Desktop-only soft light + ring that trails the pointer. */
export function CursorEffect() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let active = false;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      active = !!el?.closest("a,button,[role=button],input,label");
    };
    const loop = () => {
      const k = reduced ? 1 : 0.16;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${active ? 1.8 : 1})`;
        ring.current.style.opacity = active ? "0.9" : "0.5";
      }
      if (light.current) light.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine) return null;
  return (
    <>
      <div
        ref={light}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[5] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(235,207,213,0.07)_0%,transparent_65%)]"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] size-7 rounded-full border border-paper/60 transition-[opacity,scale] duration-300"
      />
    </>
  );
}
