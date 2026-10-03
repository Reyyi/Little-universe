"use client";

import Image from "next/image";
import { useRef } from "react";
import { beginningStory } from "@/data/chapters";
import type { StoryBeat } from "@/data/types";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ChapterEnd } from "@/components/shell/ChapterEnd";

const DESKTOP = "(min-width: 768px)";
const MOBILE = "(max-width: 767px)";

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} data-word className="inline-block whitespace-pre">
          {w + " "}
        </span>
      ))}
    </>
  );
}

function Beat({ beat }: { beat: StoryBeat }) {
  switch (beat.kind) {
    case "title":
      return (
        <section data-beat="title" className="relative flex h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
          <p data-reveal className="eyebrow">{beat.caption}</p>
          <h1 data-title className="display mt-6 text-[clamp(3.5rem,13vw,13rem)] uppercase tracking-[-0.03em]">
            {beat.text}
          </h1>
          <p data-reveal className="eyebrow mt-10 animate-breathe">Scroll slowly</p>
        </section>
      );
    case "line":
      return (
        <section data-beat="line" className="flex min-h-[70svh] items-center justify-center px-6 md:h-svh">
          <p className="display max-w-5xl text-balance text-center text-[clamp(2.4rem,7vw,7rem)] italic">
            <Words text={beat.text ?? ""} />
          </p>
        </section>
      );
    case "photo":
      return beat.photo ? (
        <section data-beat="photo" className="relative flex min-h-[80svh] items-center justify-center px-5 md:h-svh md:px-0">
          <figure className="relative w-full md:h-full">
            <div data-frame className="relative aspect-[4/5] w-full overflow-hidden md:absolute md:inset-0 md:aspect-auto">
              <Image
                data-img
                src={beat.photo.src}
                alt={beat.photo.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/30" />
            </div>
            {beat.caption && (
              <figcaption data-caption className="relative mt-4 font-hand text-2xl text-blush md:absolute md:bottom-16 md:left-16 md:mt-0 md:text-4xl">
                {beat.caption}
              </figcaption>
            )}
          </figure>
        </section>
      ) : null;
    case "finale":
      return (
        <section data-beat="finale" className="flex min-h-[80svh] items-center justify-center px-6 md:h-svh">
          <p data-finale className="display max-w-6xl text-balance text-center text-[clamp(2.8rem,9vw,10rem)] italic text-blush">
            {beat.text}
          </p>
        </section>
      );
  }
}

/**
 * Hierarchy: chapter title → one sentence per screen → full-bleed photographs.
 * Desktop: every beat is pinned and scrubbed (words light up, photos open like an aperture).
 * Mobile: no pinning — shorter sections that reveal once. Reduced motion: static.
 */
export function BeginningStory() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(DESKTOP, () => {
        q("[data-beat=title]").forEach((el) => {
          gsap.from(el.querySelectorAll("[data-reveal]"), { opacity: 0, y: 20, stagger: 0.2, duration: 1.6, delay: 0.6 });
          gsap.from(el.querySelector("[data-title]"), { opacity: 0, letterSpacing: "0.2em", duration: 2.4, ease: "expo.out" });
          gsap.to(el.querySelector("[data-title]"), {
            scale: 0.82,
            opacity: 0,
            filter: "blur(10px)",
            scrollTrigger: { trigger: el, start: "top top", end: "+=100%", scrub: true, pin: true },
          });
        });
        q("[data-beat=line]").forEach((el) => {
          const words = el.querySelectorAll("[data-word]");
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=120%", scrub: 0.6, pin: true } })
            .fromTo(words, { opacity: 0.08, y: 18, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.25 })
            .to(words, { opacity: 0, y: -24, stagger: 0.05 }, "+=0.6");
        });
        q("[data-beat=photo]").forEach((el) => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=140%", scrub: 0.6, pin: true } })
            .fromTo(el.querySelector("[data-frame]"), { clipPath: "inset(22% 30% 22% 30%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" })
            .fromTo(el.querySelector("[data-img]"), { scale: 1.3 }, { scale: 1, ease: "none" }, 0)
            .fromTo(el.querySelector("[data-caption]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.5);
        });
        q("[data-beat=finale]").forEach((el) => {
          gsap.fromTo(
            el.querySelector("[data-finale]"),
            { opacity: 0, scale: 0.9, filter: "blur(12px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", scrollTrigger: { trigger: el, start: "top top", end: "+=80%", scrub: 0.8, pin: true } },
          );
        });
      });

      mm.add(MOBILE, () => {
        q("[data-beat]").forEach((el) => {
          const targets = el.querySelectorAll("[data-word],[data-frame],[data-caption],[data-finale],[data-title],[data-reveal]");
          gsap.from(targets, {
            opacity: 0,
            y: 24,
            stagger: 0.06,
            duration: 1.2,
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          });
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root}>
      {beginningStory.map((beat) => (
        <Beat key={beat.id} beat={beat} />
      ))}
      <ChapterEnd id="beginning" line="And that was only the beginning." />
    </div>
  );
}
