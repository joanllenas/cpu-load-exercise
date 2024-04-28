import CurrentLoadWidget from './components/CurrentLoadWidget';
import LoadTimeWindowWidget from './components/LoadTimeWindowWidget';
import AppContainer from './ui/AppContainer';
import Alert from './ui/Alert';
import HighLoadAlertsWidget from './components/HighLoadAlertsWidget';
import { useLoadAverageData } from './data/useLoadAverageData';

function App() {
  const loadAverageData = useLoadAverageData();

  if (loadAverageData.error !== null) {
    return (
      <AppContainer>
        <Alert variant="error">Error: {loadAverageData.error}</Alert>
      </AppContainer>
    );
  }

  if (loadAverageData.loadOverTime.length === 0) {
    return (
      <AppContainer>
        <Alert>Loading...</Alert>
      </AppContainer>
    );
  }

  const currentLoad =
    loadAverageData.loadOverTime.at(loadAverageData.loadOverTime.length - 1)
      ?.value || 0;

  return (
    <AppContainer>
      <CurrentLoadWidget currentLoad={currentLoad} />
      <LoadTimeWindowWidget loadOverTime={loadAverageData.loadOverTime} />
      <HighLoadAlertsWidget loadAlerts={loadAverageData.loadAlertState.list} />
    </AppContainer>
  );
}

export default App;
