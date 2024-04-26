import { toPercentage, formatPercentage } from '../lib/utils';

interface Props {
  currentLoad: number;
}

const toBarClipPath = (n: number) => {
  const pct = toPercentage(1 - n);
  return { clipPath: `polygon(0 ${pct}, 100% ${pct}, 100% 100%, 0 100%)` };
};

export default function CurrentLoadWidget({ currentLoad }: Props) {
  return (
    <div className="relative flex items-center justify-center shadow-xl shadow-slate-800 w-52 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <span className="z-10 font-bold opacity-50 text-7xl text-slate-100 font-numbers">
        {formatPercentage(currentLoad)}
      </span>
      <div
        className="absolute w-full h-full transition-all duration-1000 ease-out"
        style={toBarClipPath(currentLoad)}>
        <div className="absolute bg-gradient-to-t to-80% from-green-700 to-red-900 w-full h-full"></div>
      </div>
      <div className="absolute w-full h-full stripes-texture"></div>
    </div>
  );
}
