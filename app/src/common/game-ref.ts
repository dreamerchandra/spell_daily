export type GameState = 'CORRECT' | 'INCORRECT' | 'SO_CLOSE' | 'UNANSWERED';

export type GameRef = {
  getCorrectState: () => GameState;
};

export const getGameState = (
  userInput: string[],
  correctLetters: string[]
): GameState => {
  if (userInput.includes('')) {
    return 'UNANSWERED';
  }

  const userWord = userInput.join('').toLocaleLowerCase();
  const correctWord = correctLetters.join('').toLocaleLowerCase();
  if (userWord === correctWord) {
    return 'CORRECT';
  }

  let correctCount = 0;
  userInput.forEach((letter, index) => {
    if (letter === correctLetters[index]) {
      correctCount += 1;
    }
  });

  const accuracy = correctLetters.length - correctCount <= 2;

  if (accuracy) {
    return 'SO_CLOSE';
  }

  return 'INCORRECT';
};
