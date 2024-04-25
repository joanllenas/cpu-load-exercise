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

  if (loadAverageData.data.length === 0) {
    return (
      <AppContainer>
        <Alert>Loading...</Alert>
      </AppContainer>
    );
  }

  const currentLoad = loadAverageData.data.at(
    loadAverageData.data.length - 1,
  ).value;

  return (
    <AppContainer>
      <CurrentLoadWidget currentLoad={currentLoad} />
      <WindowLoadWidget loadOverTime={loadAverageData.data} />
    </AppContainer>
  );
}

export default App;
