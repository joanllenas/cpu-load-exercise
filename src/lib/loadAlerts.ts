import { config } from '../config';
import { TimeData } from './timeWindowList';
import { minToMs } from './utils';

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
  state: LoadAlertState,
  data: TimeData,
): LoadAlertState => {
  // Default accumulator logic
  let result = {
    list: state.list,
    accumulator: accumulate(data.timestamp, data.value),
  };

  // Attempt to add a new High alert or accumulate for it
  if (isHigh(state.accumulator.value) && isHigh(data.value)) {
    const duration = data.timestamp - state.accumulator.startedAt;
    // We only add a new alert after recovery
    if (
      hasReachedLoadTimeThreshold(duration) &&
      !previousIsHighAlert(state.list)
    ) {
      result = {
        list: [highAlert(state.accumulator.startedAt), ...state.list],
        accumulator: accumulate(data.timestamp, data.value),
      };
    } else {
      result = {
        list: state.list,
        accumulator: accumulate(state.accumulator.startedAt, data.value),
      };
    }
  }

  // Attempt to add a new Recovery alert or accumulate for it
  // We only add a new alert after a high load alert
  if (
    previousIsHighAlert(state.list) &&
    !isHigh(state.accumulator.value) &&
    !isHigh(data.value)
  ) {
    const duration = data.timestamp - state.accumulator.startedAt;
    if (hasReachedLoadTimeThreshold(duration)) {
      result = {
        list: [recoveredAlert(state.accumulator.startedAt), ...state.list],
        accumulator: accumulate(data.timestamp, data.value),
      };
    } else {
      result = {
        list: state.list,
        accumulator: accumulate(state.accumulator.startedAt, data.value),
      };
    }
  }

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
  return list.length > 0 && list[0].type === 'high';
}

function hasReachedLoadTimeThreshold(value: number) {
  return value >= minToMs(config.cpuLoadTimeThresholdInMinutes);
}
