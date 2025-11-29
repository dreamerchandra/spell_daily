import type { AnswerState } from '../../common/game-ref';
import { useShortcut } from '../../hooks/use-shortcut';
import { Button } from './Button';
import type { FC } from 'react';

const IncorrectButton: FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick }) => (
  <Button onClick={onClick} variant="error" size="lg">
    💪 YOU GOT IT!
  </Button>
);

const ContinueButton: FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => {
  return (
    <Button onClick={onClick} disabled={disabled} variant={'success'} size="lg">
      CONTINUE
    </Button>
  );
};

export const Continue = ({
  onClick,
  disabled,
  answerState,
}: {
  onClick: () => void;
  disabled: boolean;
  answerState: AnswerState;
}) => {
  useShortcut('Enter', onClick);

  return (
    <div className="flex flex-col justify-center">
      {answerState === 'INCORRECT' ? (
        <IncorrectButton onClick={onClick} disabled={disabled} />
      ) : (
        <ContinueButton onClick={onClick} disabled={disabled} />
      )}
    </div>
  );
};
