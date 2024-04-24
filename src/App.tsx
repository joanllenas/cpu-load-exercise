import React from 'react';
import { useLoadAverage } from '@data/load-average.store';

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
    <div>
      <h1 className="text-3xl font-bold">Current load avg: {currentLoad}</h1>
    </div>
  );
}

export default App;
