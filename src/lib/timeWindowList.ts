export interface TimeData {
  timestamp: number;
  value: number;
}

export class TimeWindowList {
  private readonly window: TimeData[] = [];
  private readonly timeWindow: number;

  constructor(timeWindowMinutes: number) {
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  get length(): number {
    return this.window.length;
  }

  add(timestamp: number, value: number): TimeWindowList {
    console.log('add', timestamp, value);
    const data = { timestamp, value };
    this.window.push(data);
    this.moveTimeWindow(timestamp);
    return this;
  }

  at(index: number): TimeData {
    return this.window[index];
  }

  map<B>(fn: (item: TimeData, index: number) => B): B[] {
    return this.window.map(fn);
  }

  private moveTimeWindow(lastestTimestamp: number) {
    let i = 1;
    while (
      this.window.length > 0 &&
      lastestTimestamp - this.window[0].timestamp > this.timeWindow
    ) {
      console.log('removed', i++);
      this.window.shift();
    }
  }
}
