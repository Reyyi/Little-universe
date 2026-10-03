import type { TimelineEvent } from "./types";
import { photo } from "./media";

/** Shown shuffled; the player sorts them by `date`. */
export const timelineEvents: TimelineEvent[] = [
  { id: "t1", date: "2021-03", label: "I", title: "The first hello", photo: photo(1, "First hello") },
  { id: "t2", date: "2021-06", label: "II", title: "Our first long walk", photo: photo(5, "A long walk") },
  { id: "t3", date: "2021-11", label: "III", title: "The first trip together", photo: photo(9, "First trip") },
  { id: "t4", date: "2022-08", label: "IV", title: "The birthday surprise", photo: photo(12, "Birthday") },
  { id: "t5", date: "2023-01", label: "V", title: "The snow day", photo: photo(14, "Snow day") },
];
