"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import type { Media } from "@/data/types";
import { gsap } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Image with a liquid SVG displacement that swells on hover/focus. */
export function DistortImage({ media, sizes, active }: { media: Media; sizes: string; active: boolean }) {
  const id = useId().replace(/:/g, "");
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!disp.current || reduced) return;
    const tween = gsap.to(disp.current, {
      attr: { scale: active ? 26 : 0 },
      duration: active ? 0.9 : 1.2,
      ease: active ? "power2.out" : "power3.out",
    });
    return () => {
      tween.kill();
    };
  }, [active, reduced]);

  return (
    <div className="relative size-full overflow-hidden">
      <svg aria-hidden className="absolute size-0">
        <filter id={`d-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="3" />
          <feDisplacementMap ref={disp} in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        className="absolute inset-[-4%] transition-transform duration-[1.4s] ease-[var(--ease-cinema)]"
        style={{ filter: reduced ? undefined : `url(#d-${id})`, transform: active && !reduced ? "scale(1.04)" : "scale(1)" }}
      >
        <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
