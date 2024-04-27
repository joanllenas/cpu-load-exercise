export const toPercentage = (n: number): string => (100 * n).toString() + '%';

export const formatPercentage = (n: number): string =>
  Math.round(100 * n).toString() + '%';

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

export const formatDuration = (
  fromTimestamp: number,
  toTimestamp: number,
): string => {
  const duration = toTimestamp - fromTimestamp;

  const s = Math.floor((duration / 1000) % 60);
  const m = Math.floor((duration / (1000 * 60)) % 60);
  const h = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
};
