"use client";

import type { Howl as HowlType, HowlOptions } from "howler";
import { site, type SfxName } from "@/data/site";

type HowlerModule = typeof import("howler");

let howler: Promise<HowlerModule> | null = null;
/** Howler is only downloaded the first time sound is actually needed. */
export const loadHowler = () => (howler ??= import("howler"));

const sfxCache = new Map<string, HowlType>();
let ambient: HowlType | null = null;

export async function createHowl(options: HowlOptions) {
  const { Howl } = await loadHowler();
  return new Howl({ html5: false, preload: true, ...options });
}

export async function playSfx(name: SfxName | string, volume = 0.5) {
  const src = name in site.audio.sfx ? site.audio.sfx[name as SfxName] : name;
  let sound = sfxCache.get(src);
  if (!sound) {
    sound = await createHowl({ src: [src], volume });
    sfxCache.set(src, sound);
  }
  sound.volume(volume);
  sound.play();
}

export async function startAmbient() {
  if (!ambient) ambient = await createHowl({ src: [site.audio.ambient], loop: true, volume: 0 });
  if (!ambient.playing()) ambient.play();
  ambient.fade(ambient.volume(), 0.28, 2400);
}

export function stopAmbient() {
  if (!ambient) return;
  const a = ambient;
  a.fade(a.volume(), 0, 1200);
  window.setTimeout(() => a.pause(), 1250);
}

/** Ducks the ambient bed while a voice recording plays. */
export function duckAmbient(ducked: boolean) {
  if (!ambient?.playing()) return;
  ambient.fade(ambient.volume(), ducked ? 0.04 : 0.28, 800);
}
