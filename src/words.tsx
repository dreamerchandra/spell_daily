export interface WordDef {
  word: string;
  definition: string;
  audioUrl?: string;
  syllable: string[]; // for audio hints
  ipa: string[]; // for displaying pronunciation
  actualSyllable: string[]; // correct syllable split
  syllableOptions?: string[][];
  option: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  usage: string[];
}

export const sampleWords: WordDef[] = [
  {
    word: 'CULTURE',
    ipa: ['ˈkʌl', 'tʃər'],
    syllable: ['cul', 'tur'],
    actualSyllable: ['cul', 'ture'],
    definition:
      'The ideas, customs, and social behavior of a particular people or society. 🌍',
    syllableOptions: [
      ['cul', 'kul', 'col'],
      ['ture', 'chur', 'tour'],
    ],
    option: {
      easy: ['culture', 'kulture'],
      medium: ['cultuer', 'cultre'],
      hard: ['culter', 'cultare'],
    },
    usage: [
      `The museum showcases the rich ___ of the indigenous people.`,
      `Learning about different ___ helps us understand the world better.`,
      `Pop ___ has influenced many aspects of modern society.`,
    ],
  },
  {
    word: 'DEFINITELY',
    ipa: ['ˈdɛf', 'ɪ', 'nɪt', 'li'],
    syllable: ['def', 'i', 'nite', 'li'],
    actualSyllable: ['def', 'i', 'nite', 'ly'],
    definition: 'Without a doubt; for sure. ✅',
    syllableOptions: [
      ['def', 'deff', 'deaf'],
      ['i', 'e', 'a'],
      ['nite', 'night', 'nyte'],
      ['ly', 'li', 'lee'],
    ],
    option: {
      easy: ['definitely', 'definately'],
      medium: ['definetly', 'defintely'],
      hard: ['definitly', 'definatley'],
    },
    usage: [
      `I will ___ be there on time for the meeting.`,
      `She ___ knows the answer to that question.`,
      `This is ___ the best pizza I've ever tasted.`,
    ],
  },
  {
    word: 'OPINION',
    ipa: ['oʊ', 'ˈpɪn', 'jən'],
    syllable: ['o', 'pin', 'ion'],
    actualSyllable: ['o', 'pin', 'ion'],
    definition:
      'A thought or belief about something, not necessarily based on fact. 💭',
    syllableOptions: [
      ['o', 'oh', 'ow'],
      ['pin', 'pen', 'pinn'],
      ['ion', 'eon', 'yon'],
    ],
    option: {
      easy: ['opinion', 'opinnion'],
      medium: ['opinyon', 'opineon'],
      hard: ['opinyun', 'opeenion'],
    },
    usage: [
      `What's your ___ about the new movie?`,
      `Everyone has a different ___ on this topic.`,
      `In my ___, we should leave earlier.`,
    ],
  },
  {
    word: 'COUSIN',
    ipa: ['ˈkʌz', 'ɪn'],
    syllable: ['ka', 'sin'],
    actualSyllable: ['cous', 'in'],
    definition:
      'The child of your aunt or uncle; your family member who is not a sibling. 👪',
    syllableOptions: [
      ['cous', 'kous', 'cows'],
      ['in', 'en', 'inn'],
    ],
    option: {
      easy: ['cousin', 'cousen'],
      medium: ['kousin', 'couzin'],
      hard: ['cowsin', 'coussn'],
    },
    usage: [
      `My ___ is coming to visit us next week.`,
      `She introduced me to her ___ from California.`,
      `Do you know if your ___ will be at the reunion?`,
    ],
  },
  {
    word: 'IMPRESS',
    ipa: ['ɪm', 'ˈprɛs'],
    syllable: ['em', 'press'],
    actualSyllable: ['im', 'press'],
    definition: 'To make someone feel admiration and respect. 🌟',
    syllableOptions: [
      ['im', 'em', 'um'],
      ['press', 'pres', 'pross'],
    ],
    option: {
      easy: ['impress', 'impres'],
      medium: ['empress', 'impross'],
      hard: ['umpress', 'imprss'],
    },
    usage: [
      `She wanted to ___ her new boss with her skills.`,
      `The magic show will ___ the children.`,
      `His dedication to work never fails to ___ me.`,
    ],
  },
  {
    word: 'ARRANGEMENT',
    ipa: ['ə', 'ˈreɪn', 'dʒmənt'],
    syllable: ['are', 'range', 'ment'],
    actualSyllable: ['ar', 'range', 'ment'],
    definition:
      'The act of organizing or putting things in a certain order. 📅',
    syllableOptions: [
      ['ar', 'are', 'arr'],
      ['range', 'ranje', 'rang'],
      ['ment', 'mant', 'mint'],
    ],
    option: {
      easy: ['arrangement', 'arangement'],
      medium: ['arranjement', 'arrangment'],
      hard: ['arangmant', 'arrangmint'],
    },
    usage: [
      `We need to make an ___ for the meeting room.`,
      `The flower ___ looks beautiful on the table.`,
      `Can you help with the seating ___ for the party?`,
    ],
  },
  {
    word: 'EXHAUST',
    ipa: ['ɪg', 'ˈzɔst'],
    syllable: ['ex', 'haust'],
    actualSyllable: ['ex', 'haust'],
    definition: 'To use up all of something; to tire someone out. 🌬️',
    syllableOptions: [
      ['ex', 'eks', 'ax'],
      ['haust', 'host', 'hawst'],
    ],
    option: {
      easy: ['exhaust', 'exaust'],
      medium: ['eksaust', 'exhawst'],
      hard: ['axhaust', 'exhost'],
    },
    usage: [
      `The long hike will ___ even experienced runners.`,
      `We need to ___ all possibilities before deciding.`,
      `The car's ___ pipe needs to be replaced.`,
    ],
  },
  {
    word: 'MEMORABLE',
    ipa: ['ˈmɛm', 'ə', 'rə', 'bəl'],
    syllable: ['mem', 'o', 'ra', 'bel'],
    actualSyllable: ['mem', 'o', 'ra', 'ble'],
    definition: 'Something worth remembering; significant or interesting. 📝',
    syllableOptions: [
      ['mem', 'mam', 'mom'],
      ['o', 'a', 'or'],
      ['ra', 'rah', 'ray'],
      ['ble', 'bel', 'bal'],
    ],
    option: {
      easy: ['memorable', 'memorible'],
      medium: ['mamerable', 'memorahble'],
      hard: ['momarable', 'memoraybel'],
    },
    usage: [
      `The graduation ceremony was a ___ day for everyone.`,
      `She gave a ___ speech that moved the audience.`,
      `Their wedding was the most ___ event of the year.`,
    ],
  },
  {
    word: 'SPECIAL',
    ipa: ['ˈspɛʃ', 'əl'],
    syllable: ['spe', 'cial'],
    actualSyllable: ['spe', 'cial'],
    definition:
      'The ideas, customs, and social behavior of a particular people or society. 🌍',
    syllableOptions: [
      ['spe', 'spa', 'spy'],
      ['cial', 'shial', 'shal'],
    ],
    option: {
      easy: ['special', 'spesial'],
      medium: ['spashial', 'spycial'],
      hard: ['spashel', 'spyshal'],
    },
    usage: [
      `Today is a very ___ day for our family.`,
      `She has a ___ talent for music.`,
      `The restaurant offers ___ discounts on weekends.`,
    ],
  },
  {
    word: 'SYSTEM',
    ipa: ['ˈsɪs', 'təm'],
    syllable: ['sis', 'tem'],
    actualSyllable: ['sys', 'tem'],
    definition: 'A plan or way things are organized or set up. 📋',
    syllableOptions: [
      ['sys', 'sis', 'cys'],
      ['tem', 'tam', 'tim'],
    ],
    option: {
      easy: ['system', 'sistem'],
      medium: ['cystem', 'systam'],
      hard: ['cystam', 'systim'],
    },
    usage: [
      `The school has a new computer ___ installed.`,
      `Our solar ___ provides clean energy.`,
      `The traffic light ___ needs to be repaired.`,
    ],
  },
  {
    word: 'RAINBOW',
    ipa: ['ˈreɪn', 'boʊ'],
    syllable: ['rain', 'bow'],
    actualSyllable: ['rain', 'bow'],
    definition: 'Beautiful colors that appear in the sky after rain! 🌈',
    syllableOptions: [
      ['rain', 'rane', 'rein'],
      ['bow', 'bou', 'bo'],
    ],
    option: {
      easy: ['rainbow', 'rainbo'],
      medium: ['ranebow', 'reinbow'],
      hard: ['ranebou', 'reinbo'],
    },
    usage: [
      `Look at the beautiful ___ in the sky!`,
      `After the storm, a bright ___ appeared.`,
      `The ___ has seven different colors.`,
    ],
  },
  {
    word: 'BUTTERFLY',
    ipa: ['ˈbʌt', 'ər', 'flaɪ'],
    syllable: ['but', 'ter', 'fly'],
    actualSyllable: ['but', 'ter', 'fly'],
    definition: 'A pretty insect with colorful wings that can fly! 🦋',
    syllableOptions: [
      ['but', 'butt', 'bot'],
      ['ter', 'tur', 'tar'],
      ['fly', 'fli', 'flai'],
    ],
    option: {
      easy: ['butterfly', 'buterfly'],
      medium: ['butterfli', 'butterflai'],
      hard: ['botterfly', 'buttarfli'],
    },
    usage: [
      `A colorful ___ landed on the flower.`,
      `The children watched the ___ flutter around the garden.`,
      `She has a ___ tattoo on her wrist.`,
    ],
  },
  {
    word: 'ELEPHANT',
    ipa: ['ˈɛl', 'ɪ', 'fənt'],
    syllable: ['el', 'e', 'phant'],
    actualSyllable: ['el', 'e', 'phant'],
    definition: 'A big gray animal with a long trunk and big ears! 🐘',
    syllableOptions: [
      ['el', 'elle', 'al'],
      ['e', 'i', 'ee'],
      ['phant', 'fant', 'pant'],
    ],
    option: {
      easy: ['elephant', 'elefant'],
      medium: ['ellephant', 'aleephant'],
      hard: ['ellefant', 'alepant'],
    },
    usage: [
      `The ___ at the zoo loves to spray water.`,
      `An ___ never forgets, according to the saying.`,
      `We saw a baby ___ playing with its mother.`,
    ],
  },
  {
    word: 'TREASURE',
    ipa: ['ˈtrɛʒ', 'ər'],
    syllable: ['trea', 'sure'],
    actualSyllable: ['trea', 'sure'],
    definition: 'Special valuable things like gold coins and jewels! 💎',
    syllableOptions: [
      ['trea', 'tree', 'tra'],
      ['sure', 'shur', 'sur'],
    ],
    option: {
      easy: ['treasure', 'treasur'],
      medium: ['treeshure', 'treasher'],
      hard: ['trashur', 'treesur'],
    },
    usage: [
      `The pirates buried their ___ on the island.`,
      `She found a ___ chest full of gold coins.`,
      `Family photos are a ___ to keep forever.`,
    ],
  },
];
