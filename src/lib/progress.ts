import { chapters } from "@/data/chapters";
import { secrets } from "@/data/secrets";
import type { Chapter } from "@/data/types";
import type { ExperienceStore } from "@/store/experience";

export type NodeState = "locked" | "available" | "completed" | "secret";

type ProgressSlice = Pick<ExperienceStore, "completedChapters" | "discoveredSecrets" | "newGamePlus">;

export function isUnlocked(chapter: Chapter, s: ProgressSlice) {
  if (s.newGamePlus && chapter.kind === "chapter") return true;
  const afterOk = (chapter.unlock.after ?? []).every((id) => s.completedChapters.includes(id));
  const secretsOk = s.discoveredSecrets.length >= (chapter.unlock.minSecrets ?? 0);
  return afterOk && secretsOk;
}

export function chapterState(chapter: Chapter, s: ProgressSlice): NodeState {
  if (s.completedChapters.includes(chapter.id)) return "completed";
  const unlocked = isUnlocked(chapter, s);
  if (chapter.kind === "secret") return unlocked ? "available" : "secret";
  return unlocked ? "available" : "locked";
}

export function overallProgress(s: ProgressSlice) {
  const done = chapters.filter((c) => s.completedChapters.includes(c.id)).length;
  return done / chapters.length;
}

export function nextChapter(s: ProgressSlice) {
  return chapters.find((c) => c.kind === "chapter" && chapterState(c, s) === "available");
}

export const secretsTotal = secrets.length;
