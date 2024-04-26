import { HighLoadEvent } from '../data/LoadAverageContext';
import { formatTime } from '../lib/utils';
import Alert from '../ui/Alert';

interface Props {
  // TODO: remove any
  highLoadEvents: HighLoadEvent[];
}

export default function HighLoadEventsWidget({ highLoadEvents }: Props) {
  if (highLoadEvents.length === 0) {
    return <Alert>There are no high load events to show yet.</Alert>;
  }

  return (
    <div>
      <ul>
        {highLoadEvents.map((item) => (
          <li key={item.initialTimestamp}>
            <div className="flex">
              <div className="flex flex-col w-1/4 p-4 border-r border-dashed border-slate-700">
                <span>Start time: {formatTime(item.initialTimestamp)}</span>
                <span>
                  End time:{' '}
                  {item.finalTimestamp === 'ongoing'
                    ? 'Ongoing...'
                    : formatTime(item.initialTimestamp)}
                </span>
              </div>
              <div className="">sdfdsfdf</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
