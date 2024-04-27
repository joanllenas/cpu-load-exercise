export const config = {
  apiUrl: 'http://localhost:3001/api',
  cpuLoadRefreshIntervalInSeconds: 10,
  cpuLoadTimeWindowInMinutes: 10,
  // high/restored load thresholds
  cpuHighLoadThresholdValue: 0.01,
  cpuHighLoadTimeThresholdInMinutes: 1,
  cpuRecoveryTimeThresholdInMinutes: 1,
};

setTimeout(
  () => {
    if (config.cpuHighLoadThresholdValue === 0.01) {
      config.cpuHighLoadThresholdValue = 1;
    } else {
      config.cpuHighLoadThresholdValue = 0.01;
    }
  },
  3 * 60 * 1000,
);
