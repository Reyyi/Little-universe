"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Transition, Variants } from "motion/react";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1.2 });
  registered = true;
}
registerGsap();

export { gsap, ScrollTrigger, useGSAP };

export const ease = {
  cinema: [0.22, 1, 0.36, 1] as const,
  soft: [0.65, 0, 0.35, 1] as const,
};

export const transition = {
  slow: { duration: 1.6, ease: ease.cinema } satisfies Transition,
  base: { duration: 0.9, ease: ease.cinema } satisfies Transition,
  quick: { duration: 0.45, ease: ease.cinema } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: transition.slow },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.slow },
};

export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Standard reveal for elements entering the viewport via ScrollTrigger. */
export function scrollReveal(targets: gsap.TweenTarget, trigger: Element, reduced: boolean) {
  if (reduced) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    targets,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, stagger: 0.12, scrollTrigger: { trigger, start: "top 80%", once: true } },
  );
}
