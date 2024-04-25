import React from 'react';

export default function AppContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-12">
      {children}
    </div>
  );
}
