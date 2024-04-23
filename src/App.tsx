import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="text-3xl font-bold">Vite + React</h1>
      <div>
        <button
          className="p-2 border bg-slate-100"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
