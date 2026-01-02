// app config
import { CONFIG } from "./config";

export const INSTANT_APP_ID = CONFIG.INSTANT_APP_ID;

export const UNSPLASH_ACCESS_KEY =CONFIG.UNSPLASH_ACCESS_KEY;

// reactions
export const EMOJIS = ["❤️", "😂", "🔥", "👍", "😍"];

// user name helpers
const ADJECTIVES = [
  "Creative",
  "Sunny",
  "Silent",
  "Mighty",
  "Swift",
  "Bold",
  "Zesty",
];

const NOUNS = [
  "Panda",
  "Eagle",
  "Dolphin",
  "Tiger",
  "Wolf",
  "Owl",
];

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export const generateRandomUser = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: `${adj} ${noun}`,
    color,
  };
};
