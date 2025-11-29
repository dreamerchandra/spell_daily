import { Continue } from './continue';
import { CheckButton } from './check-button';
import type { FC } from 'react';
import type { AnswerState } from '../../common/game-ref';

export const FooterButton: FC<{
  answerState: AnswerState;
  onClickContinue: () => void;
  onCheckAnswer: () => AnswerState;
  disableContinue: boolean;
  disableChecking: boolean;
  canContinue: boolean;
}> = ({
  answerState,
  onClickContinue,
  disableContinue,
  onCheckAnswer,
  disableChecking,
  canContinue,
}) => {
  const onClick = () => {
    if (canContinue) {
      return onClickContinue();
    }
    onCheckAnswer();
  };
  return (
    <div className="max-w-[300px] w-[80%] m-auto">
      {canContinue ? (
        <Continue
          disabled={disableContinue}
          onClick={onClick}
          answerState={answerState}
        />
      ) : (
        <CheckButton
          answerState={answerState}
          onClick={onClick}
          disableChecking={disableChecking}
        />
      )}
    </div>
  );
};
