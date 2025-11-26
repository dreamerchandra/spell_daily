import { Fragment, useCallback, useRef, useState, type FC } from 'react';
import { DroppableSlot } from './droppable-slot';
import type { WordDef } from '../../../words';
import { pubSub } from '../../../util/pub-sub';
import { useSetTimeout } from '../../../hooks/use-setTimeout';
import {
  successSoundManager,
  SuccessAnimationType,
} from '../../../util/soundManager';
import { useOnCorrect } from '../../../hooks/use-on-correct';

export const SyllableInput: FC<{
  wordDef: WordDef;
  state: {
    selectedSyllables: string[];
    isCorrect: boolean | null;
  };
  selectSyllable: (syllable: string, targetIndex: number) => void;
  removeSyllable: (index: number) => void;
}> = ({ wordDef, state, selectSyllable, removeSyllable }) => {
  const completedAnimations = useRef(0);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const totalSyllables = wordDef.actualSyllable.length;
  const timer = useSetTimeout();

  const handleIndividualAnimationEnd = useCallback(() => {
    completedAnimations.current += 1;
    if (completedAnimations.current === totalSyllables) {
      timer(() => setShowFinalResult(true), 200);
    }
  }, [timer, totalSyllables]);

  useOnCorrect(state.isCorrect, isCorrect => {
    if (isCorrect) {
      successSoundManager.playSuccess(SuccessAnimationType.GENERIC, 1);
    } else {
      setShowFinalResult(false);
      completedAnimations.current = 0;
    }
  });

  return (
    <div className="mb-6 rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-ui-text">
        Build the word:
      </h3>
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className={`flex flex-wrap justify-center transition-all duration-200 ${state.isCorrect ? 'gap-0' : 'gap-2'}`}
        >
          {wordDef.actualSyllable.map((_, index) => (
            <Fragment key={index}>
              <DroppableSlot
                index={index}
                syllable={state.selectedSyllables[index]}
                placeholder={`Part ${index + 1}`}
                onDrop={selectSyllable}
                onRemove={removeSyllable}
                audioSyllable={wordDef.syllable[index]}
                isCorrect={state.isCorrect}
                onAnimationEnd={handleIndividualAnimationEnd}
              />
              {index < wordDef.actualSyllable.length - 1 &&
                state.isCorrect === true && (
                  <span className="mx-2 flex items-center text-gray-400">
                    +
                  </span>
                )}
            </Fragment>
          ))}
        </div>
        <div
          className={
            'animate-in slide-in-from-right-4 fade-in flex items-center duration-500' +
            (showFinalResult ? ' visible' : ' invisible')
          }
          onTransitionEnd={() => {
            pubSub.publish('Animation:End');
          }}
        >
          <span className="mx-2 flex items-center text-gray-400 ">=</span>
          <span className="text-lg font-semibold text-game-success-600">
            {wordDef.word}
          </span>
        </div>
      </div>
    </div>
  );
};
