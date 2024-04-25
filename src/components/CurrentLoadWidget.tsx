interface Props {
  cpuLoad: number;
}

const toPercentage = (n: number) => Math.round(100 * n).toString() + '%';

const toClipPath = (n: number) => {
  const pct = toPercentage(1 - n);
  return { clipPath: `polygon(0 ${pct}, 100% ${pct}, 100% 100%, 0 100%)` };
};

export default function CurrentLoadWidget({ cpuLoad }: Props) {
  return (
    <div className="relative flex items-center justify-center w-52 h-52 rounded-2xl overflow-clip bg-gradient-to-tr from-slate-600 to-slate-800">
      <span className="z-10 text-6xl font-bold opacity-50 text-slate-100">
        {toPercentage(cpuLoad)}
      </span>
      <div
        className="absolute w-full h-full transition-all duration-1000 ease-out rounded-2xl"
        style={toClipPath(cpuLoad)}
      >
        <div className="absolute bg-gradient-to-t to-80% from-green-700 to-red-900 w-full h-full"></div>
        <div className="absolute w-full h-full stripes-texture"></div>
      </div>
    </div>
  );
}
