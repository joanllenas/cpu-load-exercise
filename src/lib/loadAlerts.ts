/**
Data structure: `LoadAlertState` (custom-made).
Time: O(1).
Space: O(n).

The `LoadAlertState` data structure has two responsibilities. On the one hand, it maintains a list 
of the generated alerts (`LoadAlertState['list']`), and on the other, it tracks the latest time 
window in which a high or low value has been reached continuously (`LoadAlertState['accumulator']`). 
This tracking enables the calculation of when to generate a new alert.

The main entry point to the data structure logic is the `processLoadAlerts()` function, which takes 
the current state (`LoadAlertState`) and the new load average data point (`TimeData`).

Each time `processLoadAlerts()` is called with a new data point, a series of calculations are performed 
by comparing it with the latest generated alert data, enabling us to determine when to generate a new 
alert as specified.
 */

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
    // We only add a new alert at the beginning or after recovery
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
  // We only add a new recovery alert after a high load alert
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

// Keeps track of how long we've been on a given threshold (high or low)
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
