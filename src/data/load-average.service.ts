import { config } from '../config';

export async function getLoadAverage(): Promise<{ result: number }> {
  const response = await fetch(`${config.apiUrl}/load-average`);
  return response.json();
}
