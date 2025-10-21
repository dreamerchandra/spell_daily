import type { ReactNode } from 'react';

export const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full bg-black bg-gradient-to-r p-6 text-center text-sm text-gray-400">
      {children}
    </div>
  );
};
