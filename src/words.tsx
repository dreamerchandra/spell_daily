export interface WordDef {
  word: string;
  definition: string;
  audioUrl?: string;
  syllable: string[];
  ipa: string[];
}

export const sampleWords: WordDef[] = [
  {
    word: 'SYSTEM',
    ipa: ['ˈsɪs', 'təm'],
    syllable: ['sis', 'tem'],
    definition: 'A plan or way things are organized or set up. 📋',
  },
  {
    word: 'RAINBOW',
    ipa: ['ˈreɪn', 'boʊ'],
    syllable: ['rain', 'bow'],
    definition: 'Beautiful colors that appear in the sky after rain! 🌈',
  },
  {
    word: 'BUTTERFLY',
    ipa: ['ˈbʌt', 'ər', 'flaɪ'],
    syllable: ['but', 'ter', 'fly'],
    definition: 'A pretty insect with colorful wings that can fly! 🦋',
  },
  {
    word: 'ELEPHANT',
    ipa: ['ˈɛl', 'ɪ', 'fənt'],
    syllable: ['el', 'e', 'phant'],
    definition: 'A big gray animal with a long trunk and big ears! 🐘',
  },
  {
    word: 'TREASURE',
    ipa: ['ˈtrɛʒ', 'ər'],
    syllable: ['trea', 'sure'],
    definition: 'Special valuable things like gold coins and jewels! 💎',
  },
];
