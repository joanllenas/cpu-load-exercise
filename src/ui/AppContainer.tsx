import React from 'react';

export default function AppContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center gap-12 pt-16">
      {children}
    </div>
  );
}
