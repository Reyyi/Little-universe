import type { GalleryMemory, LittleThing } from "./types";
import { photo } from "./media";

/** Twenty collectible "little things". Photos and audio are optional. */
export const littleThings: LittleThing[] = [
  { id: "laugh", title: "The way you laugh", description: "Especially the one that starts quiet and gets away from you.", photo: photo(3, "Laughing") },
  { id: "coffee", title: "Your coffee order", description: "I could say it in my sleep. I probably have." },
  { id: "hands", title: "Cold hands", description: "Always cold. Always looking for mine.", audio: "/media/audio/soft.mp3" },
  { id: "songs", title: "Songs you ruined", description: "In the best way. I can't hear them without thinking of you." },
  { id: "texts", title: "Good morning texts", description: "Small, every day, never boring.", photo: photo(4, "A phone on a bedside table") },
  { id: "walk", title: "Walking slower", description: "You taught me there is no rush to get anywhere." },
  { id: "notes", title: "Little notes", description: "The ones you leave in places I only find later." },
  { id: "rain", title: "Rainy evenings", description: "Windows, blankets, and nothing else to do.", photo: photo(5, "Rain on a window") },
  { id: "curious", title: "Your curiosity", description: "Every question you ask makes the world bigger." },
  { id: "patience", title: "Your patience", description: "With me, mostly. Thank you for that." },
  { id: "food", title: "Stealing fries", description: "You say you aren't hungry. You are always hungry.", audio: "/media/audio/chime.mp3" },
  { id: "stars", title: "Looking up", description: "You always notice the moon before I do.", photo: photo(6, "Night sky") },
  { id: "voice", title: "Your sleepy voice", description: "Half words, half yawns." },
  { id: "kind", title: "Kindness to strangers", description: "You treat everyone like they matter, because they do." },
  { id: "photos", title: "Blurry photos", description: "Your camera roll is chaos and I love every frame.", photo: photo(7, "A blurry photo") },
  { id: "plans", title: "Plans we never made", description: "The best days were the ones we didn't plan." },
  { id: "jokes", title: "Inside jokes", description: "Nobody else gets them. Nobody else needs to." },
  { id: "brave", title: "How brave you are", description: "Even when you don't feel like it.", photo: photo(8, "Standing at the edge of the sea") },
  { id: "home", title: "Feeling like home", description: "Wherever we are." },
  { id: "you", title: "Just you", description: "Exactly as you are. That's the whole list, really." },
];

export const galleryMemories: GalleryMemory[] = [
  { id: "m1", title: "First trip", date: "Spring", note: "We got lost and called it an adventure.", photo: photo(9, "On a train"), layout: { x: 4, y: 2, w: 30, rotate: -3, depth: 0.2 } },
  { id: "m2", title: "That café", date: "Summer", note: "The one with the wobbly table.", photo: photo(10, "Café table"), layout: { x: 42, y: 8, w: 22, rotate: 2.5, depth: 0.5 } },
  { id: "m3", title: "Late night", date: "July", note: "We talked until the birds started.", photo: photo(11, "City lights"), layout: { x: 70, y: 0, w: 26, rotate: -1.5, depth: 0.3 } },
  { id: "m4", title: "Birthday", date: "August", note: "You cried at the cake. I pretended not to.", photo: photo(12, "Birthday candles"), layout: { x: 14, y: 36, w: 24, rotate: 4, depth: 0.6 } },
  { id: "m5", title: "The beach", date: "September", note: "Sand in everything, for weeks.", photo: photo(13, "The sea"), layout: { x: 46, y: 34, w: 34, rotate: -2, depth: 0.25 } },
  { id: "m6", title: "Snow day", date: "December", note: "Our worst snowman. Our best day.", photo: photo(14, "Snow"), layout: { x: 6, y: 66, w: 28, rotate: -4, depth: 0.4 } },
  { id: "m7", title: "Ordinary Tuesday", date: "Any week", note: "Nothing happened. It was perfect.", photo: photo(15, "Kitchen in the morning"), layout: { x: 40, y: 70, w: 22, rotate: 3, depth: 0.55 } },
  { id: "m8", title: "Now", date: "Today", note: "Still my favourite chapter.", photo: photo(16, "Two shadows"), layout: { x: 68, y: 62, w: 28, rotate: -1, depth: 0.35 } },
];
