export function minutesAgo(timestamp: number) {
  return Math.max(0, (Date.now() - timestamp) / 60_000);
}

export function plusMinutes(minutes: number) {
  return Date.now() + minutes * 60_000;
}
