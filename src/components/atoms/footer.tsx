import type { ReactNode } from 'react';

export const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-dark-950 w-full bg-gradient-to-r p-6 text-center text-sm text-dark-500">
      {children}
    </div>
  );
};
