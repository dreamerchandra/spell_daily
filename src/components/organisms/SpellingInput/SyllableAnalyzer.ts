import type { WordDef } from '../../../words';

export class SyllableAnalyzer {
  private wordDef: WordDef;

  constructor(wordDef: WordDef) {
    this.wordDef = wordDef;
  }

  // Get the index of the current syllable being worked on
  getCurrentSyllableIndex(userInput: string[]): number {
    let charIndex = 0;
    for (
      let syllableIndex = 0;
      syllableIndex < this.wordDef.actualSyllable.length;
      syllableIndex++
    ) {
      const syllableLength = this.wordDef.actualSyllable[syllableIndex].length;
      const syllableComplete = userInput
        .slice(charIndex, charIndex + syllableLength)
        .every(char => char !== '');

      if (!syllableComplete) {
        return syllableIndex;
      }

      charIndex += syllableLength;
    }
    return -1; // All syllables complete
  }

  // Get the starting character index for a syllable
  getSyllableStartIndex(syllableIndex: number): number {
    let startIndex = 0;
    for (let i = 0; i < syllableIndex; i++) {
      startIndex += this.wordDef.actualSyllable[i].length;
    }
    return startIndex;
  }

  // Get the ending character index for a syllable
  getSyllableEndIndex(syllableIndex: number): number {
    const startIndex = this.getSyllableStartIndex(syllableIndex);
    return startIndex + this.wordDef.actualSyllable[syllableIndex].length - 1;
  }

  // Check if character index is within a specific syllable
  isCharInSyllable(charIndex: number, syllableIndex: number): boolean {
    const startIndex = this.getSyllableStartIndex(syllableIndex);
    const endIndex = this.getSyllableEndIndex(syllableIndex);
    return startIndex <= charIndex && charIndex <= endIndex;
  }

  getAudioSyllable(charIndex: number): string {
    const syllableIndex = this.wordDef.actualSyllable.findIndex((_, index) => {
      const startIndex = this.getSyllableStartIndex(index);
      const endIndex = this.getSyllableEndIndex(index);
      return startIndex <= charIndex && charIndex <= endIndex;
    });
    return syllableIndex !== -1 ? this.wordDef.syllable[syllableIndex] : '';
  }
}
