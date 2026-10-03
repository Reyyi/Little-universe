"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ChapterId, GameId } from "@/data/types";
import { chapters } from "@/data/chapters";

export type MotionPreference = "system" | "reduced" | "full";

export interface QuizAnswer {
  choice: number;
  correct: boolean;
}

interface ExperienceState {
  currentChapter: ChapterId | null;
  visitedChapters: ChapterId[];
  completedChapters: ChapterId[];
  discoveredMemories: string[];
  discoveredSecrets: string[];
  quizAnswers: Record<string, QuizAnswer>;
  completedGames: GameId[];
  audioEnabled: boolean;
  letterOpened: boolean;
  voiceLetterPlayed: boolean;
  envelopeOpened: boolean;
  newGamePlus: boolean;
  playthroughs: number;
  motionPreference: MotionPreference;
  hasHydrated: boolean;
}

interface ExperienceActions {
  setCurrentChapter: (id: ChapterId | null) => void;
  visitChapter: (id: ChapterId) => void;
  completeChapter: (id: ChapterId) => void;
  collectMemory: (id: string) => void;
  discoverSecret: (id: string) => void;
  answerQuestion: (questionId: string, answer: QuizAnswer) => void;
  completeGame: (id: GameId) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setLetterOpened: (opened: boolean) => void;
  setVoiceLetterPlayed: (played: boolean) => void;
  setEnvelopeOpened: (opened: boolean) => void;
  setMotionPreference: (pref: MotionPreference) => void;
  startNewGamePlus: () => void;
  resetAll: () => void;
}

export type ExperienceStore = ExperienceState & ExperienceActions;

const ALL_GAMES: GameId[] = ["quiz", "timeline", "find"];

const initialState: Omit<ExperienceState, "hasHydrated" | "motionPreference" | "audioEnabled"> = {
  currentChapter: null,
  visitedChapters: [],
  completedChapters: [],
  discoveredMemories: [],
  discoveredSecrets: [],
  quizAnswers: {},
  completedGames: [],
  letterOpened: false,
  voiceLetterPlayed: false,
  envelopeOpened: false,
  newGamePlus: false,
  playthroughs: 0,
};

const addUnique = <T,>(list: T[], item: T) => (list.includes(item) ? list : [...list, item]);

export const useExperience = create<ExperienceStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      audioEnabled: false,
      motionPreference: "system",
      hasHydrated: false,

      setCurrentChapter: (id) => set({ currentChapter: id }),
      visitChapter: (id) => set((s) => ({ currentChapter: id, visitedChapters: addUnique(s.visitedChapters, id) })),
      completeChapter: (id) => set((s) => ({ completedChapters: addUnique(s.completedChapters, id) })),
      collectMemory: (id) => set((s) => ({ discoveredMemories: addUnique(s.discoveredMemories, id) })),
      discoverSecret: (id) => set((s) => ({ discoveredSecrets: addUnique(s.discoveredSecrets, id) })),
      answerQuestion: (questionId, answer) =>
        set((s) => ({ quizAnswers: { ...s.quizAnswers, [questionId]: answer } })),
      completeGame: (id) => {
        const completedGames = addUnique(get().completedGames, id);
        const allDone = ALL_GAMES.every((g) => completedGames.includes(g));
        set((s) => ({
          completedGames,
          completedChapters: allDone ? addUnique(s.completedChapters, "game") : s.completedChapters,
        }));
      },
      setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
      setLetterOpened: (letterOpened) => set({ letterOpened }),
      setVoiceLetterPlayed: (voiceLetterPlayed) => set({ voiceLetterPlayed }),
      setEnvelopeOpened: (envelopeOpened) => set({ envelopeOpened }),
      setMotionPreference: (motionPreference) => set({ motionPreference }),
      startNewGamePlus: () =>
        set((s) => ({
          newGamePlus: true,
          playthroughs: s.playthroughs + 1,
          visitedChapters: [],
          completedChapters: chapters.filter((c) => c.kind === "chapter").map((c) => c.id),
          currentChapter: null,
        })),
      resetAll: () => set({ ...initialState }),
    }),
    {
      name: "little-universe:v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => {
        const { hasHydrated, ...rest } = s;
        void hasHydrated;
        return rest;
      },
      onRehydrateStorage: () => () => useExperience.setState({ hasHydrated: true }),
    },
  ),
);

export { ALL_GAMES };
