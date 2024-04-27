import React from 'react';
import { getLoadAverage, abortLoadAverage } from './loadAverageService';
import { config } from '../config';
import { TimeData, moveTimeWindow } from '../lib/timeWindowList';

export type LoadEvent =
  | CompletedHighLoadEvent
  | OngoingHighLoadEvent
  | NormalLoadLevelRestored;

export interface CompletedHighLoadEvent {
  type: 'completed';
  timestamp: number;
  finalTimestamp: number;
}

export interface OngoingHighLoadEvent {
  type: 'ongoing';
  timestamp: number;
}

export interface NormalLoadLevelRestored {
  type: 'restored';
  timestamp: number;
}

interface LoadAverageData {
  error: string | null;
  loadOverTime: TimeData[];
  loadEvents: LoadEvent[];
}

const now = new Date();

const initialValue: LoadAverageData = {
  error: null,
  loadOverTime: [],
  loadEvents: [
    {
      type: 'ongoing',
      timestamp: now.getMilliseconds() - 1003 * 60 * 2,
    },
    {
      type: 'restored',
      timestamp: now.getMilliseconds() - 1007 * 60 * 4,
    },
    {
      type: 'completed',
      timestamp: now.getMilliseconds() - 1006 * 60 * 5,
      finalTimestamp: now.getMilliseconds() - 1001 * 60 * 4,
    },
  ],
};

const LoadAverageContext = React.createContext<LoadAverageData>(initialValue);

let intervalRef: ReturnType<typeof setInterval>;

export default function LoadAverageProvider({
  children,
}: React.PropsWithChildren) {
  const [loadAverage, setLoadAverage] =
    React.useState<LoadAverageData>(initialValue);

  React.useEffect(() => {
    loadAverageInterval(setLoadAverage);
    intervalRef = setInterval(async () => {
      loadAverageInterval(setLoadAverage);
    }, config.cpuLoadRefreshIntervalInSeconds * 1000);
    return () => {
      abortLoadAverage();
      clearInterval(intervalRef);
    };
  }, []);

  return (
    <LoadAverageContext.Provider value={loadAverage}>
      {children}
    </LoadAverageContext.Provider>
  );
}

async function loadAverageInterval(
  setLoadAverage: React.Dispatch<React.SetStateAction<LoadAverageData>>,
) {
  try {
    const { result } = await getLoadAverage();
    setLoadAverage((prevState) => ({
      ...prevState,
      error: null,
      loadOverTime: moveTimeWindow(
        [
          ...prevState.loadOverTime,
          { timestamp: new Date().getTime(), value: result },
        ],
        config.cpuLoadTimeWindowInMinutes,
      ),
    }));
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      clearInterval(intervalRef);
      setLoadAverage((prevState) => ({
        ...prevState,
        error: `There has been an error while retriving your CPU load average data: "${error.toString()}"`,
      }));
    }
  }
}

export function useLoadAverage() {
  return React.useContext(LoadAverageContext);
}
