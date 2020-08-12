import { randomBytes } from "crypto";

/**
 * Generate a random 128-bit hexadecimal ID
 * @returns unique ID
 */
export function uid(): string {
  return randomBytes(4).toString("hex");
}
