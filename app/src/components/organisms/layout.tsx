import type { ReactNode } from 'react';

export const Layout = ({
  header,
  footer,
  children,
  removeHeaderFooter = false,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  removeHeaderFooter?: boolean;
}) => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-light-gradient">
      {!removeHeaderFooter && (
        <div className="sticky top-0 z-[1000]">{header}</div>
      )}
      <main className="flex h-[calc(100dvh-237.4px)] items-center justify-center">
        {children}
      </main>
      {!removeHeaderFooter && <div className="sticky bottom-0">{footer}</div>}
    </div>
  );
};
