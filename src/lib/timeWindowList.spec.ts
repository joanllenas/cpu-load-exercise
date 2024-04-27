import { describe, expect, test } from '@jest/globals';
import { moveTimeWindow } from './timeWindowList';

const tenMinutes = 1000 * 60 * 10;

describe('moveTimeWindow', () => {
  test('keeping items within the window keeps them', () => {
    const list = [
      { timestamp: 0, value: 0 },
      { timestamp: tenMinutes, value: 0 },
    ];
    expect(moveTimeWindow(list, 10).length).toBe(2);
  });
  test('adding items moves the window and first items fall', () => {
    const list = [
      { timestamp: 0, value: 0 },
      { timestamp: tenMinutes, value: 0 },
      { timestamp: tenMinutes + 1000, value: 0 },
      { timestamp: tenMinutes + 2000, value: 0 },
      { timestamp: tenMinutes + 3000, value: 0 },
    ];
    expect(moveTimeWindow(list, 10).length).toBe(4);
  });
  test('the first items falls', () => {
    const list = [
      { timestamp: 0, value: 0 },
      { timestamp: tenMinutes, value: 1 },
      { timestamp: tenMinutes + 1000, value: 2 },
    ];
    expect(moveTimeWindow(list, 10)[0].value).toBe(1);
  });
});
