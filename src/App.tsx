import { useLoadAverage } from './data/LoadAverageContext';
import CurrentLoadWidget from './components/CurrentLoadWidget';
import WindowLoadWidget from './components/WindowLoadWidget';
import AppContainer from './ui/AppContainer';
import Alert from './ui/Alert';

function App() {
  const loadAverageData = useLoadAverage();

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
      <WindowLoadWidget loadOverTime={loadAverageData.loadOverTime} />
    </AppContainer>
  );
}

export default App;
