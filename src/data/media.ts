import type { Media } from "./types";

const sizes: Record<number, [number, number]> = {
  0: [1600, 1067],
  1: [1200, 1500],
  2: [1500, 1000],
  3: [1000, 1250],
  4: [1400, 1400],
};

/**
 * Photo helper: photo(3, "alt") -> /media/photos/photo-03.jpg.
 * Pass the real pixel size as a third argument when your photo's shape differs,
 * e.g. photo(3, "Laughing", [1080, 1350]).
 */
export function photo(n: number, alt: string, size?: [number, number]): Media {
  const [width, height] = size ?? sizes[n % 5];
  return { src: `/media/photos/photo-${String(n).padStart(2, "0")}.jpg`, alt, width, height };
}
