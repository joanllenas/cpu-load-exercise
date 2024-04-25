import React from 'react';
import { getLoadAverage } from './load-average.service';
import { config } from '../config';
import { TimeWindowList } from '../lib/time-window-list';

interface LoadAverageData {
  error: string | null;
  data: TimeWindowList<number>;
}

const initialValue = {
  error: null,
  data: new TimeWindowList<number>(config.cpuLoadTimeWindowInMinutes),
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
    }, config.cpuLoadRefreshInterval);
    return () => {
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
      error: null,
      data: prevState.data.add(new Date().getTime(), result),
    }));
  } catch (error: any) {
    clearInterval(intervalRef);
    setLoadAverage((prevState) => ({
      ...prevState,
      error: `There has been an error while retriving your CPU load average data: "${error.toString()}"`,
    }));
  }
}

export function useLoadAverage() {
  return React.useContext(LoadAverageContext);
}
