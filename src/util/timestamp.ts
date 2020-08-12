/**
 * Make a Unix timestamp
 * @returns Timestamp
 */
export function makeTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert a Unix timestamp to a JavaScript Date object
 * @param timestamp Timestamp
 * @returns Date object
 */
export function toDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}
