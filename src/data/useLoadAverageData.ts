import React from 'react';
import { LoadAverageContext } from './LoadAverageContext';

export function useLoadAverageData() {
  return React.useContext(LoadAverageContext);
}
