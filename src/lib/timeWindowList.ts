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
  const timeWindow = timeWindowMinutes * 60 * 1000;
  while (list.length > 0 && last - first > timeWindow) {
    const removed = list.shift();
    console.log('removed', removed);
    first = list[0].timestamp;
  }
  return list;
};
