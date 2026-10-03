/**
 * Everything personal lives in /src/data. Replace copy, photos and audio here —
 * UI components only read from these files.
 */
export const site = {
  title: "A Little Universe Made For Bella",
  description: "A private, handmade little universe — from Ray, for Bella.",
  recipient: "Bella",
  author: "Ray",
  monogram: "B",

  loading: "building your little universe, Bella...",

  intro: {
    lines: ["Bella, there is something I made for you.", "Take your time."],
    cta: "Enter",
  },

  envelope: {
    seal: "for Bella",
    addressedTo: "To Bella, the one who made the ordinary feel like a story",
    openLabel: "Open the envelope",
    letterPreview: "If you are reading this, you found the first door.",
    afterLines: ["Wait...", "There is more than one thing I want you to see."],
    cta: "Begin",
  },

  universe: {
    eyebrow: "Chapter map",
    title: "Bella's little universe",
    hint: "Every star is a chapter. Some only appear once you have looked closely enough.",
    newGamePlusNote: "Second time around. Everything is open now — wander wherever you like.",
  },

  letter: {
    eyebrow: "The letter",
    greeting: "Dear Bella,",
    paragraphs: [
      "I wanted to make something that could hold a little of what I feel, because saying it out loud never seems to be enough.",
      "Thank you for the quiet mornings, the long talks, the jokes nobody else would understand. Thank you for being patient with me when I am not easy to be patient with.",
      "You have a way of making ordinary days feel like they are worth remembering. This whole little universe is just me trying to remember them properly.",
      "Whatever comes next, I hope you always know that you are deeply, quietly, completely cared for.",
    ],
    signOff: "Always,",
    signature: "Ray",
  },

  voiceLetter: {
    eyebrow: "Voice letter",
    title: "I recorded something, too.",
    note: "Put on headphones if you can. Press play whenever you are ready.",
    src: "/media/audio/voice-letter.mp3",
    cta: "Continue",
  },

  ending: {
    lines: ["Thank you for making it this far.", "I hope you know how special you are, Bella. — Ray"],
    cta: "Replay our story",
  },

  replay: {
    eyebrow: "New Game+",
    title: "Again, from the beginning?",
    body: "Your discoveries stay with you. This time every door is already open.",
    keep: "Replay with everything unlocked",
    reset: "Start completely fresh",
  },

  notFound: "This page doesn't seem to belong to our little universe.",

  audio: {
    ambient: "/media/audio/ambient.mp3",
    sfx: {
      chime: "/media/audio/chime.mp3",
      soft: "/media/audio/soft.mp3",
      discover: "/media/audio/discover.mp3",
      paper: "/media/audio/paper.mp3",
    },
  },
} as const;

export type SfxName = keyof typeof site.audio.sfx;
