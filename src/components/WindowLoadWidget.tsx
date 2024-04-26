import { TimeData } from '../lib/timeWindowList';
import { toPercentage, formatTime } from '../lib/utils';

interface Props {
  loadOverTime: TimeData[];
}

const toAreaClipPath = (points: Props['loadOverTime']) => {
  if (points.length === 0) {
    return '';
  } else if (points.length === 1) {
    const pct = toPercentage(1 - (points.at(0)?.value || 0));
    return `polygon(0 ${pct}, 100% ${pct}, 100% 100%, 0 100%)`;
  }
  const proportion = 100 / (points.length - 1);
  let polygonPointPairs = points.map((point, index) => {
    return `${index * proportion}% ${toPercentage(1 - point.value)}`;
  });
  polygonPointPairs = ['0 100%', ...polygonPointPairs, '100% 100%'];
  return `polygon(${polygonPointPairs.join(', ')})`;
};

const toLeft = (index: number, len: number) => {
  if (len === 1) {
    return toPercentage(0);
  }
  const proportion = 1 / (len - 1);
  return toPercentage(index * proportion);
};

export default function WindowLoadWidget({ loadOverTime }: Props) {
  return (
    <div className="relative flex items-center justify-center w-3/4 shadow-xl shadow-slate-800 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <div
        className="absolute w-full h-full"
        style={{ clipPath: toAreaClipPath(loadOverTime) }}>
        <div className="absolute bg-gradient-to-t to-80% from-green-700 to-red-900 w-full h-full"></div>
      </div>

      {loadOverTime.map((item, index) => {
        return (
          <div
            key={item.timestamp}
            className="absolute h-full border-l border-dashed border-slate-700"
            style={{ left: toLeft(index, loadOverTime.length) }}></div>
        );
      })}

      {/* <div
        className="absolute w-full h-px bg-green-500"
        style={{ bottom: toPercentage(loadOverTime.valueRange.min) }}></div>
      <div
        className="absolute w-full h-px bg-red-500"
        style={{ bottom: toPercentage(loadOverTime.valueRange.max) }}></div> */}

      <div className="absolute w-full h-full pointer-events-none stripes-texture"></div>
    </div>
  );
}
