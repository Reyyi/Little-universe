import type { Question } from "./types";

export const questions: Question[] = [
  { id: "q1", prompt: "Where did we first meet?", options: ["At a café", "Through a friend", "At school", "Online"], answer: 1, correctNote: "You remember. Of course you do.", gentleNote: "Close — it was through a friend. Easy to forget, impossible to regret." },
  { id: "q2", prompt: "What did I notice about you first?", options: ["Your smile", "Your voice", "Your laugh", "Your eyes"], answer: 2, correctNote: "Still the best sound I know.", gentleNote: "It was your laugh. It still is." },
  { id: "q3", prompt: "What is our song?", options: ["The slow one", "The silly one", "The one from the car", "We have too many"], answer: 3, correctNote: "Far too many. Not complaining.", gentleNote: "Honestly? We have too many. Every one counts." },
  { id: "q4", prompt: "What do I always end up stealing?", options: ["Your hoodie", "The blanket", "Your fries", "Your charger"], answer: 0, correctNote: "It's mine now. Sorry.", gentleNote: "Your hoodie. I'm not giving it back." },
  { id: "q5", prompt: "What would I choose for a perfect day?", options: ["A big trip", "Staying in with you", "A concert", "A fancy dinner"], answer: 1, correctNote: "Exactly. Nothing more needed.", gentleNote: "Staying in, with you. That's all it ever takes." },
];
