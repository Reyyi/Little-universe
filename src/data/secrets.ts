import type { Secret } from "./types";
import { photo } from "./media";

/** Seven hidden stars spread across the experience. */
export const secrets: Secret[] = [
  { id: "s1", route: "/universe", hint: "Somewhere in the corner of the sky.", reward: "You always find the little things.", position: { x: 93, y: 82 } },
  { id: "s2", route: "/story/beginning", hint: "Right at the start of the beginning.", reward: "Some beginnings are worth reading twice.", position: { x: 88, y: 6 } },
  { id: "s3", route: "/story/beginning", hint: "Between two of the early lines.", reward: "I meant every word.", position: { x: 8, y: 52 } },
  { id: "s4", route: "/story/little-things", hint: "Tucked under the cards.", reward: "There were always more than twenty.", position: { x: 94, y: 96 } },
  { id: "s5", route: "/story/memories", hint: "Lost in the scrapbook.", reward: "This one was my favourite day.", position: { x: 60, y: 30 } },
  { id: "s6", route: "/game", hint: "Near the games, waiting to be noticed.", reward: "Playing with you is never really a game.", position: { x: 6, y: 90 } },
  { id: "s7", route: "/game/timeline", hint: "At the edge of time.", reward: "I'd do it all again, in any order.", position: { x: 96, y: 14 } },
];

export const secretRoom = {
  eyebrow: "Secret room",
  lockedTitle: "Not yet.",
  lockedBody: "This door opens for someone who looks closely. Find a few more hidden stars and finish the game.",
  title: "You found it.",
  photo: photo(4, "A photo I never showed anyone"),
  caption: "the photo I kept to myself",
  paragraph:
    "I have never told anyone this, but the moment I knew was not a big one. You were laughing at something silly, and I remember thinking: oh. It's you. It has been you ever since.",
  voiceNote: { src: "/media/audio/secret-note.mp3", title: "A short voice note" },
  /** Optional: set to { src: "/media/video/secret.mp4", poster?: string } */
  video: null as null | { src: string; poster?: string },
};
