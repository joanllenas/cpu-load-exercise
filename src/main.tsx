import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import LoadAverageProvider from './data/load-average.store.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadAverageProvider>
      <App />
    </LoadAverageProvider>
  </React.StrictMode>,
);
