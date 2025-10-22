export interface WordDef {
  word: string;
  definition: string;
  audioUrl?: string;
  syllable: string[];
  ipa: string[];
  actualSyllable: string[];
}

export const sampleWords: WordDef[] = [
  {
    word: 'OPINION',
    ipa: ['oʊ', 'ˈpɪn', 'jən'],
    syllable: ['o', 'pin', 'ion'],
    actualSyllable: ['o', 'pin', 'ion'],
    definition:
      'A thought or belief about something, not necessarily based on fact. 💭',
  },
  {
    word: 'COUSIN',
    ipa: ['ˈkʌz', 'ɪn'],
    syllable: ['ka', 'sin'],
    actualSyllable: ['cous', 'in'],
    definition:
      'The child of your aunt or uncle; your family member who is not a sibling. 👪',
  },
  {
    word: 'IMPRESS',
    ipa: ['ɪm', 'ˈprɛs'],
    syllable: ['em', 'press'],
    actualSyllable: ['im', 'press'],
    definition: 'To make someone feel admiration and respect. 🌟',
  },
  {
    word: 'DEFINITELY',
    ipa: ['ˈdɛf', 'ɪ', 'nɪt', 'li'],
    syllable: ['def', 'i', 'nite', 'lee'],
    actualSyllable: ['def', 'i', 'nite', 'ly'],
    definition: 'Without a doubt; for sure. ✅',
  },
  {
    word: 'ARRANGEMENT',
    ipa: ['ə', 'ˈreɪn', 'dʒmənt'],
    syllable: ['are', 'range', 'ment'],
    actualSyllable: ['ar', 'range', 'ment'],
    definition:
      'The act of organizing or putting things in a certain order. 📅',
  },
  {
    word: 'EXHAUST',
    ipa: ['ɪg', 'ˈzɔst'],
    syllable: ['ex', 'haust'],
    actualSyllable: ['ex', 'haust'],
    definition: 'To use up all of something; to tire someone out. 🌬️',
  },
  {
    word: 'MEMORABLE',
    ipa: ['ˈmɛm', 'ə', 'rə', 'bəl'],
    syllable: ['mem', 'o', 'ra', 'bel'],
    actualSyllable: ['mem', 'o', 'ra', 'ble'],
    definition: 'Something worth remembering; significant or interesting. 📝',
  },
  {
    word: 'CULTURE',
    ipa: ['ˈkʌl', 'tʃər'],
    syllable: ['cul', 'tur'],
    actualSyllable: ['cul', 'ture'],
    definition:
      'The ideas, customs, and social behavior of a particular people or society. 🌍',
  },
  {
    word: 'SPECIAL',
    ipa: ['ˈspɛʃ', 'əl'],
    syllable: ['spe', 'cial'],
    actualSyllable: ['spe', 'cial'],
    definition:
      'The ideas, customs, and social behavior of a particular people or society. 🌍',
  },
  {
    word: 'SYSTEM',
    ipa: ['ˈsɪs', 'təm'],
    syllable: ['sis', 'tem'],
    actualSyllable: ['sys', 'tem'],
    definition: 'A plan or way things are organized or set up. 📋',
  },
  {
    word: 'RAINBOW',
    ipa: ['ˈreɪn', 'boʊ'],
    syllable: ['rain', 'bow'],
    actualSyllable: ['rain', 'bow'],
    definition: 'Beautiful colors that appear in the sky after rain! 🌈',
  },
  {
    word: 'BUTTERFLY',
    ipa: ['ˈbʌt', 'ər', 'flaɪ'],
    syllable: ['but', 'ter', 'fly'],
    actualSyllable: ['but', 'ter', 'fly'],
    definition: 'A pretty insect with colorful wings that can fly! 🦋',
  },
  {
    word: 'ELEPHANT',
    ipa: ['ˈɛl', 'ɪ', 'fənt'],
    syllable: ['el', 'e', 'phant'],
    actualSyllable: ['el', 'e', 'phant'],
    definition: 'A big gray animal with a long trunk and big ears! 🐘',
  },
  {
    word: 'TREASURE',
    ipa: ['ˈtrɛʒ', 'ər'],
    syllable: ['trea', 'sure'],
    actualSyllable: ['trea', 'sure'],
    definition: 'Special valuable things like gold coins and jewels! 💎',
  },
];
