import { config } from '../config';
import { TimeData } from './timeWindowList';
import { formatDuration } from './utils';

// Types

export type LoadAlert = HighLoadAlert | RecoveredLoadAlert;

export interface HighLoadAlert {
  type: 'high';
  startedAt: number;
}

export interface RecoveredLoadAlert {
  type: 'recovered';
  startedAt: number;
}

export interface LoadAlertState {
  list: LoadAlert[];
  accumulator: { startedAt: number; value: number };
}

export const initLoadAlertState = (): LoadAlertState => ({
  list: [],
  accumulator: { startedAt: new Date().getTime(), value: 0 },
});

// -------------
//
// Main logic
//
// -------------

export const processLoadAlerts = (
  { list, accumulator }: LoadAlertState,
  { timestamp, value }: TimeData,
): LoadAlertState => {
  // Default accumulator logic
  let result = { list, accumulator: accumulate(timestamp, value) };

  // Attempt to add a new High alert or accumulate for it
  if (isHigh(accumulator.value) && isHigh(value)) {
    const duration = timestamp - accumulator.startedAt;
    // We only add a new alert after recovery
    if (
      hasReachedHighLoadTimeThreshold(duration) &&
      !previousIsHighAlert(list)
    ) {
      result = {
        list: [...list, highAlert(accumulator.startedAt)],
        accumulator: accumulate(timestamp, value),
      };
    } else {
      result = {
        list,
        accumulator: accumulate(accumulator.startedAt, value),
      };
    }
  }

  // Attempt to add a new Recovery alert or accumulate for it
  // We only add a new alert after a high load alert
  if (
    previousIsHighAlert(list) &&
    !isHigh(accumulator.value) &&
    !isHigh(value)
  ) {
    const duration = timestamp - accumulator.startedAt;
    if (hasReachedRecoveryTimeThreshold(duration)) {
      result = {
        list: [...list, recoveredAlert(accumulator.startedAt)],
        accumulator: accumulate(timestamp, value),
      };
    } else {
      result = {
        list,
        accumulator: accumulate(accumulator.startedAt, value),
      };
    }
  }

  console.log(
    formatDuration(result.accumulator.startedAt, new Date().getTime()),
  );

  return result;
};

// Type constructors

const highAlert = (startedAt: number): LoadAlert => ({
  type: 'high',
  startedAt,
});
const recoveredAlert = (startedAt: number): LoadAlert => ({
  type: 'recovered',
  startedAt,
});
const accumulate = (
  startedAt: number,
  value: number,
): LoadAlertState['accumulator'] => ({ startedAt, value });

// Utils

function isHigh(value: number) {
  return value >= config.cpuHighLoadThresholdValue;
}

function previousIsHighAlert(list: LoadAlert[]): boolean {
  return list.length > 0 && list[list.length - 1].type === 'high';
}

function hasReachedHighLoadTimeThreshold(value: number) {
  return value >= config.cpuHighLoadTimeThresholdInMinutes * 60 * 1000;
}

function hasReachedRecoveryTimeThreshold(value: number) {
  return value >= config.cpuRecoveryTimeThresholdInMinutes * 60 * 1000;
}
