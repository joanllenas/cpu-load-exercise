import { config } from '../config';

let loadAverageController = new AbortController();
let signal = loadAverageController.signal;

export function abortLoadAverage() {
  loadAverageController.abort();
  loadAverageController = new AbortController();
  signal = loadAverageController.signal;
}

export async function getLoadAverage(): Promise<{ result: number }> {
  const response = await fetch(`${config.apiUrl}/load-average`, { signal });
  //return response.json();
  //TODO: remove mock!!!
  return Promise.resolve({ result: Math.random() });
}
