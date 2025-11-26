import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { type ReactNode } from 'react';

export const RiveFooter = ({ isSuccess }: { isSuccess: boolean }) => {
  const { RiveComponent } = useRive({
    src: '/rive/footer_animation.riv',
    autoplay: true,
    autoBind: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.BottomCenter,
    }),
  });
  if (!isSuccess) {
    return null;
  }
  return <RiveComponent />;
};
export const Footer = ({
  children,
  isSuccess,
}: {
  children: ReactNode;
  isSuccess: boolean;
}) => {
  return (
    <div className="relative w-full pb-6 text-center text-sm text-ui-textMuted">
      <div className="relative z-10">{children}</div>
      <div className="absolute bottom-0 h-[200px] w-full text-center text-sm text-ui-textMuted">
        <RiveFooter isSuccess={isSuccess} />
      </div>
    </div>
  );
};
