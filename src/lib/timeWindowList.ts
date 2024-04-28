/**
Data structure: `Sliding window`.
Time: O(n).
Space: O(n).
 */

import { minToMs } from './utils';

export interface TimeData {
  timestamp: number;
  value: number;
}

export const moveTimeWindow = (
  list: TimeData[],
  timeWindowMinutes: number,
): TimeData[] => {
  const timeWindow = minToMs(timeWindowMinutes);
  let start = 0;
  const end = list.length - 1;
  const last = list[end].timestamp;
  // Advance the start index until the window is within the allowed time span
  while (start <= end && last - list[start].timestamp > timeWindow) {
    start++;
  }
  return list.slice(start, end + 1);
};
