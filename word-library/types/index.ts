export interface WordData {
  word: string,
  ipa: string[],
  syllable: string[],
  actualSyllable: string[],
  definition: string,
  syllableOptions: string[][],
  option: Record<'easy' | 'medium' | 'hard', string[]>,
  usage: string[]
}
