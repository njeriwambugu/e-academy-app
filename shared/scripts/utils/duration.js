function secondsFrom(value) {
  return Math.max(0, Number(value) || 0);
}

export function formatDurationClock(totalSeconds) {
  const seconds = secondsFrom(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function formatDurationCompact(totalSeconds) {
  const seconds = secondsFrom(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes}m ${String(remainder).padStart(2, "0")}s` : `${remainder}s`;
}
