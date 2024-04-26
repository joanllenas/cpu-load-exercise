import React from 'react';
import { getLoadAverage, abortLoadAverage } from './loadAverageService';
import { config } from '../config';
import { TimeWindowList } from '../lib/timeWindowList';

interface LoadAverageData {
  error: string | null;
  data: TimeWindowList;
}

const initialValue = {
  error: null,
  data: new TimeWindowList(config.cpuLoadTimeWindowInMinutes),
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
      console.log('interval call');
      loadAverageInterval(setLoadAverage);
    }, config.cpuLoadRefreshInterval);
    return () => {
      console.log('aborting effect');
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
    console.log('getLoadAverage');
    const { result } = await getLoadAverage();
    console.log('GOT loadAverage', result);
    setLoadAverage((prevState) => ({
      error: null,
      data: prevState.data.add(new Date().getTime(), result),
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
