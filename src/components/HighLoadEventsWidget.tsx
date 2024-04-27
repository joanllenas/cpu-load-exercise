import { LoadEvent } from '../data/LoadAverageContext';
import { classNames } from '../lib/classNames';
import { filterMap, formatDuration, formatTime } from '../lib/utils';
import Alert from '../ui/Alert';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';

interface Props {
  loadEvents: LoadEvent[];
}

export default function HighLoadEventsWidget({ loadEvents }: Props) {
  if (loadEvents.length === 0) {
    return <Alert>There are no load events to show yet.</Alert>;
  }

  return (
    <div className="w-1/2 px-6 mx-auto">
      <ul>
        {filterMap(
          loadEvents,
          (loadEvent) =>
            loadEvent.type !== 'ongoingHighLoad' &&
            loadEvent.type !== 'ongoingRestoration',
          (loadEvent) => (
            <li key={loadEvent.timestamp} className="group">
              <div className="pb-8">
                <div className="relative flex items-center space-x-3">
                  <span className="absolute w-px left-7 top-10 h-1/2 bg-slate-500 group-last:hidden" />
                  <EventIcon event={loadEvent} />
                  <EventContent event={loadEvent} />
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

function EventIcon({ event }: { event: LoadEvent }) {
  let Icon = ExclamationTriangleIcon;
  let bgColor = 'bg-red-500';
  if (event.type === 'restoredHighLoad') {
    Icon = CheckIcon;
    bgColor = 'bg-green-500';
  }
  return (
    <div
      className={classNames(
        bgColor,
        'h-8 w-8 rounded-full flex items-center justify-center',
      )}>
      <Icon className="w-5 h-5 text-slate-100" />
    </div>
  );
}

function EventContent({ event }: { event: LoadEvent }) {
  return (
    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
      <div>
        <p className="text-sm text-slate-400">
          {event.type === 'restoredHighLoad' ? (
            <span>Normal load levels were restored</span>
          ) : event.type === 'completedHighLoad' ? (
            <span>
              High load event lasted for{' '}
              <span className="text-slate-300">
                {formatDuration(event.timestamp, event.finalTimestamp)}
              </span>
            </span>
          ) : null}
        </p>
      </div>
      <div className="text-sm text-right text-slate-400 whitespace-nowrap">
        <time
          dateTime={formatTime(event.timestamp)}
          title={new Date(event.timestamp).toDateString()}>
          {formatTime(event.timestamp)}
        </time>
      </div>
    </div>
  );
}
