import { describe, expect, test } from '@jest/globals';
import {
  LoadAlertState,
  initLoadAlertState,
  processLoadAlerts,
} from './loadAlerts';
import { config } from '../config';
import { minToMs, sToMs } from './utils';

function highCPUValueGen() {
  return config.cpuHighLoadThresholdValue + Math.random();
}

function lowCPUValueGen() {
  return Math.max(0, config.cpuHighLoadThresholdValue - Math.random());
}

let alternating = true;
function alternateCPUValueGen() {
  alternating = !alternating;
  return alternating ? config.cpuHighLoadThresholdValue : 0;
}

function mockAdvanceTime(
  timeTresholdTimes: number,
  valueGen: () => number,
  state: LoadAlertState = initLoadAlertState(),
): LoadAlertState {
  const destination =
    state.accumulator.startedAt +
    minToMs(config.cpuLoadTimeThresholdInMinutes * timeTresholdTimes);
  const step = sToMs(config.cpuLoadRefreshIntervalInSeconds);
  for (let t = state.accumulator.startedAt; t <= destination; t += step) {
    state = processLoadAlerts(state, {
      timestamp: t,
      value: valueGen(),
    });
  }
  return state;
}

describe('processLoadAlerts', () => {
  test('there are no alerts initially', () => {
    expect(initLoadAlertState().list.length).toBe(0);
  });
  test('one alert is generated after the time threshold is exceeded one time, with values consistently >= to the high CPU threshold.', () => {
    const state = mockAdvanceTime(1, highCPUValueGen);
    expect(state.list.length).toBe(1);
    expect(state.list[0].type).toBe('high');
  });
  test('only one alert is generated after the time threshold is exceeded five times, with values consistently >= to the high CPU threshold.', () => {
    const state = mockAdvanceTime(5, highCPUValueGen);
    expect(state.list.length).toBe(1);
    expect(state.list[0].type).toBe('high');
  });
  test('after generating a high load alert, a recovery alert is generated once the recovery threshold time has passed', () => {
    let state = mockAdvanceTime(5, highCPUValueGen);
    state = mockAdvanceTime(1, lowCPUValueGen, state);
    expect(state.list.length).toBe(2);
    expect(state.list[0].type).toBe('recovered');
    expect(state.list[1].type).toBe('high');
  });
  test('only one recovery alert is generated after the recovery threshold is exceeded five times', () => {
    let state = mockAdvanceTime(5, highCPUValueGen);
    state = mockAdvanceTime(5, lowCPUValueGen, state);
    expect(state.list.length).toBe(2);
    expect(state.list[0].type).toBe('recovered');
    expect(state.list[1].type).toBe('high');
  });
  test('succession of highs and lows', () => {
    let state = mockAdvanceTime(5, highCPUValueGen);
    state = mockAdvanceTime(5, lowCPUValueGen, state);
    state = mockAdvanceTime(5, highCPUValueGen, state);
    state = mockAdvanceTime(5, lowCPUValueGen, state);
    expect(state.list.length).toBe(4);
    expect(state.list[0].type).toBe('recovered');
    expect(state.list[1].type).toBe('high');
    expect(state.list[2].type).toBe('recovered');
    expect(state.list[3].type).toBe('high');
  });

  test('when the threshold is never reached, no alerts are created', () => {
    let state = mockAdvanceTime(5, alternateCPUValueGen);
    state = mockAdvanceTime(5, alternateCPUValueGen, state);
    state = mockAdvanceTime(5, alternateCPUValueGen, state);
    state = mockAdvanceTime(5, alternateCPUValueGen, state);
    expect(state.list.length).toBe(0);
  });
});
