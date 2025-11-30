import { type FC } from 'react';
import { Button } from './Button';
import type { AnswerState } from '../../common/game-ref';
import { useShortcut } from '../../hooks/use-shortcut';

// Individual button components for each state
const CheckStateButton: FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <Button onClick={onClick} disabled={disabled} variant="primary" size="lg">
    CHECK
  </Button>
);

const CorrectButton: FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <Button
    onClick={() => {
      if (disabled) {
        return;
      }
      onClick();
    }}
    variant="success"
    size="lg"
  >
    CORRECT
  </Button>
);

const IncorrectButton: FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <Button
    onClick={() => {
      if (disabled) {
        return;
      }
      onClick();
    }}
    variant="error"
    size="lg"
  >
    WRONG
  </Button>
);

const SoCloseButton: FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => (
  <Button
    onClick={() => {
      if (disabled) {
        return;
      }
      onClick();
    }}
    variant="error"
    size="lg"
  >
    SO CLOSE
  </Button>
);

export const CheckButton: FC<{
  onClick: () => void;
  disableChecking: boolean;
  answerState: AnswerState;
}> = ({ onClick, disableChecking, answerState }) => {
  useShortcut('Enter', onClick);

  return (
    <div className="flex flex-col justify-center">
      {answerState === 'SO_CLOSE' && (
        <p className="mb-2 text-center text-lg text-yellow-600">
          So close! Try again.
        </p>
      )}
      {answerState === 'UNANSWERED' && (
        <CheckStateButton onClick={onClick} disabled={disableChecking} />
      )}
      {answerState === 'CORRECT' && (
        <CorrectButton onClick={onClick} disabled={disableChecking} />
      )}
      {answerState === 'SO_CLOSE' && (
        <SoCloseButton onClick={onClick} disabled={disableChecking} />
      )}
      {answerState === 'INCORRECT' && (
        <IncorrectButton onClick={onClick} disabled={disableChecking} />
      )}
    </div>
  );
};
