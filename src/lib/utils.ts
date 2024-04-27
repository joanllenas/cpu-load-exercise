export const toPercentage = (n: number): string => (100 * n).toString() + '%';

/**
 * Converts [0..1] to [0..100]%
 */
export const formatPercentage = (n: number): string =>
  Math.round(100 * n).toString() + '%';

/**
 * Formats timestamp as hh:mm:ss in 24h format
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

/**
 * Formats timestamp difference as either `1h 2m 5s` or `9m 3s` (when less than an hour)
 */
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

/**
 * Filters and maps the provied list in a sigle pass
 */
export const filterMap = <A, B>(
  list: A[],
  filterFn: (a: A) => boolean,
  mapFn: (a: A) => B,
): B[] => {
  return list.reduce((prev, curr) => {
    if (filterFn(curr)) {
      prev.push(mapFn(curr));
    }
    return prev;
  }, [] as B[]);
};
