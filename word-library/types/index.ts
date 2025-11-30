export type Topic = 'people' | 'places' | 'food' | 'school' | 'work' | 'actions' | 'objects' | 'feelings' | 'time' | 'nature' | 'technology' | 'travel' | 'health' | 'culture' | 'communication' | 'society' | 'numbers' | 'environment' | 'clothing' | 'entertainment';

export interface WordData {
  word: string;
  ipa: string[];
  syllable: string[];
  actualSyllable: string[];
  definition: string;
  syllableOptions: string[][];
  option: Record<'easy' | 'medium' | 'hard', string[]>;
  usage: string[];
  synonyms: string[];
  antonyms: string[];
  topic_tag: Topic;
  word_family: string[];
}
