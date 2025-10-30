export const showPlaceholder = (hint: number) => hint >= 3;
export const showSyllable = (hint: number) => hint >= 2;

export const findActiveIndex = (userInput: string[]) =>
  userInput.findIndex(l => l === '');
