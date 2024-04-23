import React from 'react';
import { getLoadAverage } from './load-average.service';
import { config } from '../config';

interface LoadAverage {
  timestamp: number;
  value: number;
}

interface LoadAverageData {
  error: string | null;
  data: LoadAverage[];
}

const initialValue = { error: null, data: [] };

const LoadAverageContext = React.createContext<LoadAverageData>(initialValue);

let intervalRef: ReturnType<typeof setInterval>;

export default function LoadAverageProvider({
  children,
}: React.PropsWithChildren) {
  console.log('LoadAverageProvider');
  const [loadAverage, setLoadAverage] =
    React.useState<LoadAverageData>(initialValue);

  React.useEffect(() => {
    console.log('First effect call');
    loadAverageInterval(loadAverage, setLoadAverage);
    intervalRef = setInterval(async () => {
      console.log('effect interval');
      loadAverageInterval(loadAverage, setLoadAverage);
    }, config.cpuRefreshInterval);
    return () => {
      console.log('effect destroy');
      clearInterval(intervalRef);
    };
  }, []);

  return (
    <LoadAverageContext.Provider value={loadAverage}>
      {children}
    </LoadAverageContext.Provider>
  );
}

export function useLoadAverage() {
  return React.useContext(LoadAverageContext);
}

async function loadAverageInterval(
  loadAverage: LoadAverageData,
  setLoadAverage: React.Dispatch<React.SetStateAction<LoadAverageData>>,
) {
  try {
    const { result } = await getLoadAverage();

    setLoadAverage({
      error: null,
      data: [
        ...loadAverage.data,
        { timestamp: new Date().getTime(), value: result },
      ],
    });
  } catch (error: any) {
    clearInterval(intervalRef);
    setLoadAverage({
      ...loadAverage,
      error: `There has been an error while retriving your CPU load average data: "${error.toString()}"`,
    });
  }
}
