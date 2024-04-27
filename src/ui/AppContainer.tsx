import React from 'react';

export default function AppContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center max-w-6xl gap-12 px-16 pt-16 mx-auto">
      {children}
    </div>
  );
}
