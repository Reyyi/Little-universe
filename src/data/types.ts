export type ChapterId =
  | "beginning"
  | "little-things"
  | "memories"
  | "game"
  | "secrets"
  | "letter";

export type GameId = "quiz" | "timeline" | "find";

export interface Media {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Chapter {
  id: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  route: string;
  /** Node position on the constellation map, roughly -1..1 */
  position: [number, number, number];
  kind: "chapter" | "secret";
  unlock: { after?: ChapterId[]; minSecrets?: number };
}

export interface RouteMeta {
  /** Prefix matched against pathname */
  path: string;
  label: string;
  chapter?: ChapterId;
  /** Hides most HUD chrome for emotional scenes */
  immersive?: boolean;
}

export interface StoryBeat {
  id: string;
  kind: "title" | "line" | "photo" | "finale";
  text?: string;
  caption?: string;
  photo?: Media;
}

export interface LittleThing {
  id: string;
  title: string;
  description: string;
  photo?: Media;
  audio?: string;
}

export interface GalleryMemory {
  id: string;
  title: string;
  date: string;
  note: string;
  photo: Media;
  /** Desktop composition, in % of the canvas */
  layout: { x: number; y: number; w: number; rotate: number; depth: number };
}

export interface Question {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  correctNote: string;
  gentleNote: string;
}

export interface TimelineEvent {
  id: string;
  /** Sortable ISO-ish date; only used to verify the order */
  date: string;
  label: string;
  title: string;
  photo?: Media;
}

export interface Secret {
  id: string;
  route: string;
  hint: string;
  reward: string;
  /** Position inside the page, in % of page width / height */
  position: { x: number; y: number };
}
