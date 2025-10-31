import type { ReactNode } from 'react';

export const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="w-full p-6 text-center text-sm"
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-muted)',
      }}
    >
      {children}
    </div>
  );
};
