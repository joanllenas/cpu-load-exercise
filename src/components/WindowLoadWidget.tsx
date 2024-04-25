import { TimeWindowList } from '../lib/timeWindowList';
import { toPercentage } from '../lib/utils';

interface Props {
  loadOverTime: TimeWindowList<number>;
}

const toAreaClipPath = (points: Props['loadOverTime']) => {
  if (points.length === 0) {
    return '';
  }
  const hProportion = 100 / (points.length - 1);
  let polygonPointPairs = points.map((point, index) => {
    return `${index * hProportion}% ${toPercentage(1 - point.value)}`;
  });
  polygonPointPairs = ['0 100%', ...polygonPointPairs, '100% 100%'];
  return `polygon(${polygonPointPairs.join(', ')})`;
};

export default function WindowLoadWidget({ loadOverTime }: Props) {
  return (
    <div className="relative flex items-center justify-center w-3/4 shadow-xl shadow-slate-800 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <div
        className="absolute w-full h-full"
        style={{ clipPath: toAreaClipPath(loadOverTime) }}>
        <div className="absolute bg-gradient-to-t to-80% from-green-700 to-red-900 w-full h-full"></div>
      </div>

      <div className="absolute w-full h-full stripes-texture"></div>
    </div>
  );
}
