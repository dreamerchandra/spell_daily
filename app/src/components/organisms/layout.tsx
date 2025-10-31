import type { ReactNode } from 'react';

export const Layout = ({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="bg-theme-main h-screen w-screen overflow-hidden">
      <div className="sticky top-0 z-[1000]">{header}</div>
      <main className="flex h-[calc(100vh-200px)] items-center justify-center">
        {children}
      </main>
      <div className="sticky bottom-0">{footer}</div>
    </div>
  );
};
