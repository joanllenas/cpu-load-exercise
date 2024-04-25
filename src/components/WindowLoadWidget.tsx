import { SlidingTimeWindow } from '../lib/sliding-time-window';

interface Props {
  loadOverTime: SlidingTimeWindow<number>;
}

const toPercentage = (n: number) => Math.round(100 * n).toString() + '%';

const toClipPath = (points: Props['loadOverTime']) => {
  if (points.length === 0) {
    return '';
  }
  const proportion = 100 / (points.length - 1);
  let polygonPointPairs = points.map((point, index) => {
    return `${index * proportion}% ${toPercentage(1 - point.value)}`;
  });
  polygonPointPairs = ['0 100%', ...polygonPointPairs, '100% 100%'];
  return `polygon(${polygonPointPairs.join(', ')})`;
};

export default function WindowLoadWidget({ loadOverTime }: Props) {
  return (
    <div className="relative flex items-center justify-center w-3/4 shadow-xl shadow-slate-800 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <div
        className="absolute w-full h-full transition-all duration-1000 ease-out rounded-2xl"
        style={{ clipPath: toClipPath(loadOverTime) }}
      >
        <div className="absolute bg-gradient-to-t to-80% from-green-700 to-red-900 w-full h-full"></div>
      </div>

      <div className="absolute w-full h-full stripes-texture"></div>
    </div>
  );
}
