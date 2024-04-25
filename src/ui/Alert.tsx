import React from 'react';
import { classNames } from '../lib/classNames';

interface Props {
  variant?: 'warning' | 'error';
}

export default function Alert({
  variant,
  children,
}: React.PropsWithChildren<Props>) {
  const variantClasses =
    variant === 'warning'
      ? 'bg-orange-400 text-orange-800'
      : variant === 'error'
        ? 'bg-red-400 text-red-800'
        : 'bg-slate-400 text-slate-800';
  return (
    <div
      className={classNames(
        'px-9 py-6 shadow-xl shadow-slate-800 rounded-2xl',
        variantClasses,
      )}>
      {children}
    </div>
  );
}
