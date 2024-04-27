import { classNames } from '../lib/classNames';
import { LoadAlert } from '../lib/loadAlerts';
import { formatTime } from '../lib/utils';
import Alert from '../ui/Alert';
import {
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';

interface Props {
  loadAlerts: LoadAlert[];
}

export default function HighLoadAlertsWidget({ loadAlerts }: Props) {
  if (loadAlerts.length === 0) {
    return (
      <Alert>
        <InformationCircleIcon className="inline-block w-7 h-7 text-slate-700" />
        There are no high load alerts to show yet.
      </Alert>
    );
  }

  return (
    <div className="w-1/2 px-6 mx-auto">
      <ul>
        {loadAlerts.map((loadAlert) => (
          <li key={loadAlert.startedAt} className="group">
            <div className="pb-8">
              <div className="relative flex items-center space-x-3">
                <span className="absolute w-px left-7 top-10 h-1/2 bg-slate-500 group-last:hidden" />
                <AlertIcon alert={loadAlert} />
                <AlertContent alert={loadAlert} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AlertIcon({ alert }: { alert: LoadAlert }) {
  let Icon = ExclamationTriangleIcon;
  let bgColor = 'bg-red-500';
  if (alert.type === 'recovered') {
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

function AlertContent({ alert }: { alert: LoadAlert }) {
  return (
    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
      <div>
        <p className="text-sm text-slate-400">
          {alert.type === 'recovered' ? (
            <span>Normal load levels were restored</span>
          ) : alert.type === 'high' ? (
            <span>High load alert</span>
          ) : null}
        </p>
      </div>
      <div className="text-sm text-right text-slate-400 whitespace-nowrap">
        <time
          dateTime={formatTime(alert.startedAt)}
          title={new Date(alert.startedAt).toDateString()}>
          {formatTime(alert.startedAt)}
        </time>
      </div>
    </div>
  );
}
