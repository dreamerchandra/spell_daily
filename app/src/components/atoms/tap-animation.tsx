import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

export const RiveTapAnimation = ({ isShown }: { isShown: boolean }) => {
  const { RiveComponent, rive } = useRive({
    src: '/rive/tap_animation.riv',
    autoplay: true,
    autoBind: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.TopLeft,
    }),
  });
  const [x, y] = useMemo(() => {
    const rect = document
      .getElementById('jumbled_letter-0')
      ?.getBoundingClientRect()!;
    return [rect.left, rect.top];
  }, []);
  useEffect(() => {
    if (isShown) {
      rive?.play();
    } else {
      rive?.pause();
    }
  }, [isShown, rive]);
  if (!isShown) {
    return null;
  }
  return (
    <div
      className="absolute left-[42px] top-[562px] h-[200px] w-[200px]"
      style={
        x && y
          ? {
              left: `${x}px`,
              top: `${y}px`,
            }
          : {}
      }
    >
      <div className="relative">
        <div className="absolute left-[-77px] top-[-58px] h-[200px] w-[200px]">
          <RiveComponent />
        </div>
      </div>
    </div>
  );
};

export const TapAnimation = ({ isShown }: { isShown: boolean }) => {
  const portal = useMemo(
    () =>
      createPortal(
        <div className="absolute left-0 top-0 h-[100dvh] w-[100dvw]">
          <div className="relative">
            <RiveTapAnimation isShown={isShown} />
          </div>
        </div>,
        document.body
      ),
    [isShown]
  );

  return portal;
};
