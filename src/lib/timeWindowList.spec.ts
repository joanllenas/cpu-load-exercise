import { describe, expect, test } from '@jest/globals';
import { TimeWindowList } from './timeWindowList';

const tenMinutes = 1000 * 60 * 10;

describe('TimeWindowList', () => {
  test('keeping items within the window keeps them', () => {
    const instance = new TimeWindowList<number>(10)
      .add(0, 0)
      .add(tenMinutes, 1);
    expect(instance.length).toBe(2);
  });
  test('adding items moves the window and first items fall', () => {
    const instance = new TimeWindowList<number>(10)
      .add(0, 234324)
      .add(tenMinutes, 233242)
      .add(tenMinutes + 1000, 3453)
      .add(tenMinutes + 2000, 345345)
      .add(tenMinutes + 3000, 345345);
    expect(instance.length).toBe(4);
  });
  test('the first items falls', () => {
    const instance = new TimeWindowList<number>(10)
      .add(0, 0)
      .add(tenMinutes, 1)
      .add(tenMinutes + 1000, 2);
    expect(instance.at(0).value).toBe(1);
  });
});
