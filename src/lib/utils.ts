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
