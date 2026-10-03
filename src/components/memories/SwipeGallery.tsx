"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import { galleryMemories } from "@/data/memories";
import type { GalleryMemory } from "@/data/types";

/** Mobile: one memory per swipe, the next one peeking in from the side. */
export function SwipeGallery({ onOpen, openId }: { onOpen: (m: GalleryMemory) => void; openId: string | null }) {
  return (
    <div className="pb-16">
      <Swiper modules={[A11y, Keyboard]} keyboard slidesPerView={1.18} spaceBetween={18} centeredSlides grabCursor className="!px-2 !py-6">
        {galleryMemories.map((m, i) => (
          <SwiperSlide key={m.id}>
            <button
              type="button"
              onClick={() => onOpen(m)}
              aria-label={`Open memory: ${m.title}`}
              className="relative block w-full bg-[#efe6da] p-3 pb-14 text-left shadow-[0_24px_40px_-20px_rgba(0,0,0,0.9)]"
              style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}
            >
              <motion.div layoutId={`memory-${m.id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-ink-800" style={{ opacity: openId === m.id ? 0 : 1 }}>
                <Image src={m.photo.src} alt={m.photo.alt} fill sizes="85vw" className="object-cover" />
              </motion.div>
              <span className="absolute bottom-4 left-4 font-hand text-2xl text-[#5a4650]">{m.title}</span>
              <span className="absolute bottom-5 right-4 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-[#8a7880]">{m.date}</span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <p className="eyebrow mt-2 text-center">Swipe →</p>
    </div>
  );
}
