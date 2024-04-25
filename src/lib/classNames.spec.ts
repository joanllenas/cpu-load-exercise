import { describe, expect, test } from '@jest/globals';
import { classNames } from './classNames';

describe('classNames module', () => {
  test('one class', () => {
    expect(classNames('hello')).toBe('hello');
  });
  test('two classes', () => {
    expect(classNames('hello', 'world')).toBe('hello world');
  });

  test('classes and falsy', () => {
    expect(
      classNames('hello', undefined, 'world', false, 'good', '', 'bye'),
    ).toBe('hello world good bye');
  });
});
