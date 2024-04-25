import { LoadAverage } from '../data/LoadAverageContext';

interface Props {
  loadOverTime: LoadAverage[];
}

export default function WindowLoadWidget({ loadOverTime }: Props) {
  return <div>{loadOverTime.map((v) => v.value).join(', ')}</div>;
}
