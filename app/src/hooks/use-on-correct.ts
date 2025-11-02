import { useRef, useEffect } from 'react';

export const useOnCorrect = (
  isCorrect: boolean | null,
  cb: (isCorrect: boolean | null) => void
) => {
  const cbRef = useRef(cb);
  const previousIsCorrectRef = useRef<boolean | null>(null);
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => {
    console.log({ isCorrect, previous: previousIsCorrectRef.current });
    if (previousIsCorrectRef.current !== isCorrect) {
      previousIsCorrectRef.current = isCorrect;
      cbRef.current(isCorrect);
    }
  }, [isCorrect]);
};
