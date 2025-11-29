export type AnswerState = 'CORRECT' | 'INCORRECT' | 'SO_CLOSE' | 'UNANSWERED';

export type GameRef = {
  getCorrectState: () => AnswerState;
};

export const getGameState = (
  userInput: string[],
  correctLetters: string[]
): AnswerState => {
  if (userInput.includes('')) {
    return 'UNANSWERED';
  }

  const userWord = userInput.join('').toLocaleLowerCase();
  const correctWord = correctLetters.join('').toLocaleLowerCase();
  if (userWord === correctWord) {
    return 'CORRECT';
  }

  return 'INCORRECT';
};
