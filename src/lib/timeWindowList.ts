export interface TimeData<T> {
  timestamp: number;
  value: T;
}

export class TimeWindowList<T> {
  private window: TimeData<T>[] = [];
  private windowMap = new Map<number, TimeData<T>>();
  private readonly timeWindow: number;

  constructor(timeWindowMinutes: number) {
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  get length(): number {
    return this.window.length;
  }

  add(timestamp: number, value: T): TimeWindowList<T> {
    if (!this.windowMap.has(timestamp)) {
      const data = { timestamp, value };
      this.window.push(data);
      this.windowMap.set(timestamp, data);
      while (
        this.window.length > 0 &&
        timestamp - this.window[0].timestamp > this.timeWindow
      ) {
        this.windowMap.delete(this.window.shift()?.timestamp!);
      }
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
