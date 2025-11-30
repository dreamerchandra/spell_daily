import {
  Alignment,
  EventType,
  Fit,
  Layout,
  useRive,
} from '@rive-app/react-canvas';
import { useEffect, type ReactNode } from 'react';
import { footerAnimation } from '../../util/riveManager';

export const RiveFooter = ({
  isSuccess,
  onAnimationComplete,
}: {
  isSuccess: boolean;
  onAnimationComplete: () => void;
}) => {
  const { RiveComponent, rive } = useRive({
    buffer: footerAnimation.getBuffer(),
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.BottomCenter,
    }),
  });

  useEffect(() => {
    let timerId = 0;
    const onStop = () => {
      onAnimationComplete();
    };
    if (isSuccess) {
      rive?.play();
    } else {
      rive?.reset();
    }
    rive?.on(EventType.Stop, onStop);
    return () => {
      clearTimeout(timerId);
      rive?.off(EventType.Stop, onStop);
    };
  }, [isSuccess, onAnimationComplete, rive]);

  return <RiveComponent style={isSuccess ? {} : { display: 'none' }} />;
};
export const Footer = ({
  children,
  isSuccess,
  onAnimationComplete,
}: {
  children: ReactNode;
  isSuccess: boolean;
  onAnimationComplete: () => void;
}) => {
  return (
    <div className="fixed bottom-0 w-full pb-6 text-center text-sm text-ui-textMuted">
      <div className="relative z-10">{children}</div>
      <div
        className={`absolute bottom-0  ${isSuccess ? 'h-[200px]' : 'h-[100px]'} border-t-2 w-full text-center text-sm text-ui-textMuted`}
      >
        <RiveFooter
          isSuccess={isSuccess}
          onAnimationComplete={onAnimationComplete}
        />
      </div>
    </div>
  );
};
