import { DotLottiePlayer } from './player';
import { FallbackAnimation } from './fallback-animation';
import type { AnimationInfoComponent } from './type';

export const AnimationPlayer = ({
  lottiePath,
  info,
  onDone,
  loop,
}: {
  lottiePath: string | undefined;
  info: AnimationInfoComponent;
  onDone: () => void;
  loop?: boolean;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50">
      {!lottiePath ? (
        <FallbackAnimation onDone={onDone} info={info} />
      ) : (
        <DotLottiePlayer
          blob={lottiePath}
          onDone={onDone}
          info={info}
          loop={loop}
        />
      )}
    </div>
  );
};
