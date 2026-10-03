import type { Chapter, ChapterId, RouteMeta, StoryBeat } from "./types";
import { photo } from "./media";

export const chapters: Chapter[] = [
  { id: "beginning", number: 1, title: "The Beginning", subtitle: "where it started", route: "/story/beginning", position: [-2.6, -0.9, 0], kind: "chapter", unlock: {} },
  { id: "little-things", number: 2, title: "Little Things", subtitle: "twenty small treasures", route: "/story/little-things", position: [-1.2, 0.9, -0.6], kind: "chapter", unlock: { after: ["beginning"] } },
  { id: "memories", number: 3, title: "Memories", subtitle: "a scrapbook", route: "/story/memories", position: [0.3, -0.3, 0.4], kind: "chapter", unlock: { after: ["little-things"] } },
  { id: "game", number: 4, title: "The Game", subtitle: "how well do you remember?", route: "/game", position: [1.6, 1.1, -0.3], kind: "chapter", unlock: { after: ["memories"] } },
  { id: "secrets", number: 5, title: "Secrets", subtitle: "for your eyes only", route: "/secrets", position: [0.9, 2.1, -1.2], kind: "secret", unlock: { after: ["game"], minSecrets: 4 } },
  { id: "letter", number: 6, title: "The Letter", subtitle: "the last page", route: "/letter", position: [2.8, -0.6, 0.2], kind: "chapter", unlock: { after: ["game"] } },
];

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, Chapter>;

/** Most specific path first. */
export const routeMeta: RouteMeta[] = [
  { path: "/story/beginning", label: "The Beginning", chapter: "beginning" },
  { path: "/story/little-things", label: "Little Things", chapter: "little-things" },
  { path: "/story/memories", label: "Memories", chapter: "memories" },
  { path: "/game/quiz", label: "The Game — Questions", chapter: "game" },
  { path: "/game/timeline", label: "The Game — Timeline", chapter: "game" },
  { path: "/game/find", label: "The Game — Hidden Stars", chapter: "game" },
  { path: "/game", label: "The Game", chapter: "game" },
  { path: "/secrets", label: "Secrets", chapter: "secrets", immersive: true },
  { path: "/letter", label: "The Letter", chapter: "letter", immersive: true },
  { path: "/ending", label: "Ending", immersive: true },
  { path: "/replay", label: "New Game+" },
  { path: "/universe", label: "Universe" },
  { path: "/enter", label: "Envelope", immersive: true },
  { path: "/", label: "Intro", immersive: true },
];

export function metaForPath(pathname: string): RouteMeta | undefined {
  return routeMeta.find((m) => (m.path === "/" ? pathname === "/" : pathname.startsWith(m.path)));
}

export const beginningStory: StoryBeat[] = [
  { id: "title", kind: "title", text: "The Beginning", caption: "Chapter one" },
  { id: "remember", kind: "line", text: "I still remember when..." },
  { id: "p1", kind: "photo", photo: photo(1, "The first photo of us"), caption: "the first time — somewhere, sometime" },
  { id: "noidea", kind: "line", text: "At the time, I had no idea..." },
  { id: "p2", kind: "photo", photo: photo(2, "An ordinary afternoon"), caption: "an ordinary afternoon that wasn't" },
  { id: "become", kind: "line", text: "...that you would become..." },
  { id: "important", kind: "finale", text: "...someone this important." },
];

/** Little Things chapter is complete once this many cards are collected. */
export const littleThingsGoal = 12;
