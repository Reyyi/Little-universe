"use client";

import { forwardRef } from "react";
import { site } from "@/data/site";

/** The physical letter. Each line is a `[data-line]` so the reveal can pace it. */
export const LetterPaper = forwardRef<HTMLElement>(function LetterPaper(_, ref) {
  const { letter } = site;
  return (
    <article
      ref={ref}
      className="paper-surface relative mx-auto w-full max-w-2xl px-7 py-12 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] sm:px-16 sm:py-20"
    >
      <p data-line className="font-sans text-[0.6rem] uppercase tracking-[0.36em] text-[#8a7880]">
        {letter.eyebrow}
      </p>
      <p data-line className="mt-8 font-hand text-4xl text-[#5a4650]">
        {letter.greeting}
      </p>
      <div className="mt-6 space-y-6">
        {letter.paragraphs.map((p, i) => (
          <p key={i} data-line className="font-display text-xl leading-relaxed text-[#2a2228] sm:text-[1.4rem]">
            {p}
          </p>
        ))}
      </div>
      <p data-line className="mt-10 font-display text-xl italic text-[#5a4650]">
        {letter.signOff}
      </p>
      <p data-line className="font-hand text-4xl text-[#8e4f5d]">
        {letter.signature}
      </p>
    </article>
  );
});
