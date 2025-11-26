import React, { useState } from 'react';

type AnimationType = 'flyDown' | 'slideLeft' | 'rotateIn' | 'bounce' | 'flipIn';

interface DroppableSlotProps {
  index: number;
  syllable: string;
  audioSyllable: string;
  placeholder: string;
  onDrop: (syllable: string, targetIndex: number) => void;
  onRemove?: (index: number) => void;
  isCorrect?: boolean | null;
  animationType?: AnimationType;
  onAnimationEnd: () => void;
}

const getAnimationClasses = (
  animationType: AnimationType,
  isVisible: boolean
) => {
  const animations = {
    flyDown: {
      visible: 'translate-y-0 scale-100 transform opacity-100',
      hidden: '-translate-y-12 scale-125 transform opacity-0',
      duration: 'duration-[600ms]',
      easing: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
    },
    slideLeft: {
      visible: 'translate-x-0 scale-100 transform opacity-100',
      hidden: 'translate-x-20 scale-90 transform opacity-0',
      duration: 'duration-[500ms]',
      easing: 'ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
    },
    rotateIn: {
      visible: 'rotate-0 scale-100 transform opacity-100',
      hidden: 'rotate-180 scale-50 transform opacity-0',
      duration: 'duration-[700ms]',
      easing: 'ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
    },
    bounce: {
      visible: 'translate-y-0 scale-100 transform opacity-100',
      hidden: 'translate-y-16 scale-75 transform opacity-0',
      duration: 'duration-[800ms]',
      easing: 'ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]',
    },
    flipIn: {
      visible: 'rotateY-0 scale-100 transform opacity-100',
      hidden: 'rotateY-90 scale-110 transform opacity-0',
      duration: 'duration-[650ms]',
      easing: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
    },
  };

  const anim = animations[animationType];
  return {
    classes: isVisible ? anim.visible : anim.hidden,
    duration: anim.duration,
    easing: anim.easing,
  };
};

export const SuccessDroppableSlot: React.FC<DroppableSlotProps> = ({
  index,
  syllable,
  placeholder,
  animationType = 'flyDown',
  onAnimationEnd,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimationEnded, setHasAnimationEnded] = useState(false);

  React.useEffect(() => {
    // Different delays for different animation types
    const delayMultipliers = {
      flyDown: 120,
      slideLeft: 100,
      rotateIn: 150,
      bounce: 140,
      flipIn: 110,
    };

    const animationDelay = index * delayMultipliers[animationType] + 50;
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [index, animationType]);

  // Handle animation end detection
  const handleTransitionEnd = React.useCallback(() => {
    if (isVisible && !hasAnimationEnded) {
      setHasAnimationEnded(true);
      onAnimationEnd();
    }
  }, [isVisible, hasAnimationEnded, onAnimationEnd]);

  const animation = getAnimationClasses(animationType, isVisible);

  return (
    <div className="relative inline-block">
      <div
        className={`rounded-lg border-2 border-dashed border-game-success-500 bg-game-success-100 px-3 py-2 text-center font-medium text-game-success-700 transition-all ${animation.duration} ${animation.easing} ${animation.classes}`}
        data-droppable-slot={index}
        onTransitionEnd={handleTransitionEnd}
      >
        {syllable || placeholder}
      </div>
    </div>
  );
};
