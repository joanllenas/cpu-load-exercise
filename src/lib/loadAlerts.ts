import { config } from '../config';
import { TimeData } from './timeWindowList';

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
  // Adding a new High alert
  if (isHigh(accumulator.value) && isHigh(value)) {
    const duration = timestamp - accumulator.startedAt;
    if (hasReachedHighLoadTimeThreshold(duration)) {
      return {
        list: [...list, high(accumulator.startedAt)],
        accumulator: accumulate(timestamp, value),
      };
    }
  }

  // Adding a new Recovered alert
  if (
    previousIsHighAlert(list) &&
    !isHigh(accumulator.value) &&
    !isHigh(value)
  ) {
    const duration = timestamp - accumulator.startedAt;
    if (hasReachedRecoveryTimeThreshold(duration)) {
      return {
        list: [...list, recovered(accumulator.startedAt)],
        accumulator: accumulate(timestamp, value),
      };
    }
  }
  return { list, accumulator: accumulate(timestamp, value) };
};

// Type constructors

const high = (startedAt: number): LoadAlert => ({ type: 'high', startedAt });
const recovered = (startedAt: number): LoadAlert => ({
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

function previousIsHighAlert(list: LoadAlert[]) {
  return list.length > 0 && list[list.length - 1].type === 'high';
}

function hasReachedHighLoadTimeThreshold(value: number) {
  return value >= config.cpuHighLoadTimeThresholdInMinutes * 60 * 1000;
}

function hasReachedRecoveryTimeThreshold(value: number) {
  return value >= config.cpuRecoveryTimeThresholdInMinutes * 60 * 1000;
}
