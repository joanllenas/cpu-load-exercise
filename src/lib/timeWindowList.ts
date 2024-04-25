export interface TimeData<T> {
  timestamp: number;
  value: T;
}

export class TimeWindowList<T> {
  private window: TimeData<T>[];
  private readonly maxInterval: number;

  constructor(maxIntervalMinutes: number) {
    this.window = [];
    this.maxInterval = maxIntervalMinutes * 60 * 1000;
  }

  get length(): number {
    return this.window.length;
  }

  add(timestamp: number, value: T): TimeWindowList<T> {
    this.window.push({ timestamp, value });
    while (
      this.window.length > 0 &&
      timestamp - this.window[0].timestamp > this.maxInterval
    ) {
      this.window.shift();
    }
    return this;
  }

  at(index: number): TimeData<T> {
    return this.window[index];
  }

  map<B>(fn: (item: TimeData<T>, index: number) => B): B[] {
    return this.window.map(fn);
  }
}
