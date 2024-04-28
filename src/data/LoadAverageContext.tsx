import React from 'react';
import { getLoadAverage, abortLoadAverage } from './loadAverageService';
import { config } from '../config';
import { TimeData, moveTimeWindow } from '../lib/timeWindowList';
import {
  initLoadAlertState,
  LoadAlertState,
  processLoadAlerts,
} from '../lib/loadAlerts';
import { minToMs, sToMs } from '../lib/utils';

interface LoadAverageData {
  error: string | null;
  loadOverTime: TimeData[];
  loadAlertState: LoadAlertState;
}

// Prefill the previous 10 minutes with a value of 0
const now = new Date().getTime();
const backwardsTimeWindow = minToMs(config.cpuLoadTimeWindowInMinutes);
const initialTime = now - backwardsTimeWindow;
const step = sToMs(config.cpuLoadRefreshIntervalInSeconds);
const loadOverTime: TimeData[] = [];
for (let t = now; t >= initialTime; t -= step) {
  loadOverTime.unshift({ timestamp: t, value: 0 });
}
const initialValue: LoadAverageData = {
  error: null,
  loadOverTime,
  loadAlertState: initLoadAlertState(),
};

export const LoadAverageContext =
  React.createContext<LoadAverageData>(initialValue);

let intervalRef: ReturnType<typeof setInterval>;

export default function LoadAverageProvider({
  children,
}: React.PropsWithChildren) {
  const [loadAverageData, setLoadAverageData] =
    React.useState<LoadAverageData>(initialValue);

  React.useEffect(() => {
    loadAverageInterval(setLoadAverageData);
    intervalRef = setInterval(async () => {
      loadAverageInterval(setLoadAverageData);
    }, sToMs(config.cpuLoadRefreshIntervalInSeconds));
    return () => {
      abortLoadAverage();
      clearInterval(intervalRef);
    };
  }, []);

  return (
    <LoadAverageContext.Provider value={loadAverageData}>
      {children}
    </LoadAverageContext.Provider>
  );
}

async function loadAverageInterval(
  setLoadAverage: React.Dispatch<React.SetStateAction<LoadAverageData>>,
) {
  const timestamp = new Date().getTime();
  try {
    const { result } = await getLoadAverage();

    setLoadAverage((prevState) => ({
      error: null,
      loadOverTime: moveTimeWindow(
        [...prevState.loadOverTime, { timestamp, value: result }],
        config.cpuLoadTimeWindowInMinutes,
      ),
      loadAlertState: processLoadAlerts(prevState.loadAlertState, {
        timestamp,
        value: result,
      }),
    }));
  } catch (error) {
    if (error.name !== 'AbortError') {
      clearInterval(intervalRef);
      setLoadAverage((prevState) => ({
        ...prevState,
        error: `There has been an error while retriving your CPU load average data: "${error.toString()}"`,
      }));
    }
  }
}
