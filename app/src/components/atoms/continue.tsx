import { useState } from 'react';
import { useSubscribe } from '../../hooks/usePubSub';
import { useSetTimeout } from '../../hooks/use-setTimeout';
import {
  DELAY_NEXT_WORD_MS,
  DELAY_NEXT_WORD_MS_FAST,
} from '../../config/animation-knobs';
import { useIsTestMode } from '../../context/hint-context';

export const Continue = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  const setTimer = useSetTimeout();
  const isTestMode = useIsTestMode();
  const [isProgressing, setIsProgressing] = useState(false);

  useSubscribe('Animation:End', () => {
    if (!disabled) {
      setIsProgressing(true);
      setTimer(
        () => {
          onClick();
          setIsProgressing(false);
        },
        isTestMode ? DELAY_NEXT_WORD_MS_FAST : DELAY_NEXT_WORD_MS
      );
    }
  });

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative transform overflow-hidden rounded-xl border-2 border-game-primary-500 bg-transparent px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105"
    >
      <span className="relative z-10">CONTINUE</span>
      {/* Progress overlay */}
      {isProgressing && (
        <div
          className="absolute inset-0 bg-game-primary-500"
          style={{
            animation: `progressFill ${DELAY_NEXT_WORD_MS}ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards`,
          }}
        />
      )}
      <style>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </button>
  );
};
