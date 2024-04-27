import { minToMs } from './utils';

export interface TimeData {
  timestamp: number;
  value: number;
}

export const moveTimeWindow = (
  list: TimeData[],
  timeWindowMinutes: number,
): TimeData[] => {
  let first = list[0].timestamp;
  let last = list[list.length - 1].timestamp;
  const timeWindow = minToMs(timeWindowMinutes);
  while (list.length > 0 && last - first > timeWindow) {
    list.shift();
    first = list[0].timestamp;
  }
  return list;
};
