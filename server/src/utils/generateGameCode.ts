import { customAlphabet } from "nanoid";

export function generateGameCode(): string {
  return customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5)();
}
