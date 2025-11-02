import { useState, type FC } from 'react';
import { Button } from './Button';
import { useSetTimeout } from '../../hooks/use-setTimeout';

export const CheckButton: FC<{
  onCheckAnswer: () => boolean | null;
  disableChecking: boolean;
}> = ({ onCheckAnswer, disableChecking }) => {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const timer = useSetTimeout();

  return (
    <Button
      onClick={() => {
        setIsCorrect(onCheckAnswer());
        timer(() => {
          setIsCorrect(null);
        }, 2000);
      }}
      className="m-auto w-[80%]"
      disabled={disableChecking}
      variant={isCorrect === null ? 'primary' : isCorrect ? 'success' : 'error'}
      size="lg"
    >
      {isCorrect === null ? 'CHECK' : isCorrect ? 'CORRECT' : 'WRONG'}
    </Button>
  );
};
