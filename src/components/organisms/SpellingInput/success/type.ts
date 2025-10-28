import type { SpellingInputBaseProps } from '../types';

export type AnimationInputProps = SpellingInputBaseProps & {
  onAnimationEnd: () => void;
};
