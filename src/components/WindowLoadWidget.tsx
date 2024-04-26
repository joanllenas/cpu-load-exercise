import { TimeWindowList } from '../lib/timeWindowList';
import { toPercentage, formatTime } from '../lib/utils';

interface Props {
  loadOverTime: TimeWindowList;
}

const toAreaClipPath = (points: Props['loadOverTime']) => {
  if (points.length === 0) {
    return '';
  } else if (points.length === 1) {
    const pct = toPercentage(1 - points.at(0).value);
    return `polygon(0 ${pct}, 100% ${pct}, 100% 100%, 0 100%)`;
  }
  const hProportion = 100 / (points.length - 1);
  let polygonPointPairs = points.map((point, index) => {
    return `${index * hProportion}% ${toPercentage(1 - point.value)}`;
  });
  polygonPointPairs = ['0 100%', ...polygonPointPairs, '100% 100%'];
  return `polygon(${polygonPointPairs.join(', ')})`;
};

const toBarWidth = (points: Props['loadOverTime']) => {
  if (points.length === 0) {
    return '';
  }
  const hProportion = 100 / points.length;
  return toPercentage(hProportion);
};

export default function WindowLoadWidget({ loadOverTime }: Props) {
  return (
    <div className="relative flex items-center justify-center w-3/4 shadow-xl shadow-slate-800 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <div
        className="absolute w-full h-full"
        style={{ clipPath: toAreaClipPath(loadOverTime) }}>
        <div className="absolute bg-gradient-to-t to-80% from-green-700 to-red-900 w-full h-full"></div>
      </div>

      <div className="absolute flex w-full h-full">
        {loadOverTime.map((item) => {
          return (
            <div
              key={item.timestamp}
              className="h-full hover:bg-slate-50 opacity-15"
              style={{ width: toBarWidth(loadOverTime) }}
              title={
                formatTime(item.timestamp) + ' - ' + toPercentage(item.value)
              }></div>
          );
        })}
      </div>

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
