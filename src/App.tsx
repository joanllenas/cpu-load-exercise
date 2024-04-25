import { useLoadAverage } from './data/LoadAverageContext';
import CurrentLoadWidget from './components/CurrentLoadWidget';

function App() {
  const loadAverage = useLoadAverage();

  if (loadAverage.error !== null) {
    return <div>Error: {loadAverage.error}</div>;
  }

  if (loadAverage.data.length === 0) {
    return <div>Loading...</div>;
  }

  const currentLoad = loadAverage.data[loadAverage.data.length - 1].value;

  return (
    <div className="flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Current load avg: {currentLoad}</h1>
      <CurrentLoadWidget cpuLoad={currentLoad} />
    </div>
  );
}

export default App;
