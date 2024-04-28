import React from 'react';
import { TimeData } from '../lib/timeWindowList';
import { toPercentage, formatTime, formatPercentage } from '../lib/utils';

interface Props {
  loadOverTime: TimeData[];
}

const calcPolygonClipPath = (points: Props['loadOverTime']) => {
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

const calcBarLeftPosition = (index: number, len: number) => {
  if (len === 1) {
    return toPercentage(0);
  }
  const proportion = 1 / (len - 1);
  return toPercentage(index * proportion);
};

const calcBarWidth = (len: number) => {
  if (len === 1) {
    return toPercentage(0);
  }
  const proportion = 1 / (len - 1);
  return toPercentage(proportion);
};

export default function LoadTimeWindowWidget({ loadOverTime }: Props) {
  const [hoverData, setHoverData] = React.useState(loadOverTime[0]);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const barWidth = calcBarWidth(loadOverTime.length);

  function updateTooltipPosition(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    const surface = event.currentTarget as HTMLDivElement;
    const coords = {
      x: event.clientX - surface.offsetLeft,
      y: event.clientY - surface.offsetTop,
    };

    // TODO: In PROD I would probably use useRef() and useLayoutEffect() to get the tooltip size
    const tooltipWidth = 120;
    const tooltipHeight = 20;

    const pointerMargin = 20;
    coords.x =
      coords.x > surface.offsetWidth / 2
        ? coords.x - (tooltipWidth + pointerMargin)
        : coords.x + pointerMargin;
    coords.y =
      coords.y > surface.offsetHeight / 2
        ? coords.y - (tooltipHeight + pointerMargin)
        : coords.y + pointerMargin;

    setTooltipPosition(coords);
  }

  return (
    <div
      onMouseMove={updateTooltipPosition}
      onMouseLeave={() => setTooltipVisible(false)}
      onMouseEnter={() => setTooltipVisible(true)}
      className="relative flex items-center justify-center w-full shadow-xl shadow-slate-800 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <div
        className="absolute w-full h-full"
        style={{ clipPath: calcPolygonClipPath(loadOverTime) }}>
        <div className="absolute bg-gradient-to-t to-75% from-green-700 to-red-900 w-full h-full"></div>
      </div>

      <div className="absolute w-full h-full">
        {loadOverTime.map((data, index) => {
          return (
            <div
              key={data.timestamp}
              onMouseEnter={() => setHoverData(data)}
              className="absolute h-full border-l border-dashed first:border-l-0 border-slate-700 hover:bg-slate-400 hover:bg-opacity-15"
              style={{
                left: calcBarLeftPosition(index, loadOverTime.length),
                width: barWidth,
              }}></div>
          );
        })}
        {tooltipVisible && (
          <div
            className="absolute px-2 py-1 bg-opacity-50 rounded-lg bg-slate-100"
            style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
            {`${formatTime(hoverData.timestamp)} - ${formatPercentage(hoverData.value)}`}
          </div>
        )}
      </div>

      <div className="absolute w-full h-full pointer-events-none stripes-texture"></div>
    </div>
  );
}
