import { type GameType } from './common/game-type';
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

export type WordUsage = {
  sentences: {
    correct: string[];
    options: string[];
    question: string[];
  }[];
  contextChoice: {
    sentence: string[];
    correct: string[];
    options: string[];
  }[];
  word: string;
};

export const sampleWordUsage: WordUsage[] = [
  {
    word: 'RESILIENT',
    sentences: [
      {
        question: [
          'Which sentence shows someone being resilient?',
          'Which example demonstrates resilience?',
          'Who is acting resilient in these options?',
        ],
        correct: [
          'Rina fell while skating but stood up to try again',
          'After failing the test, Maya studied harder for the next one',
          'Despite losing the game, the team practiced more for tomorrow',
        ],
        options: [
          'Arjun got a puzzle wrong and threw it away angrily',
          'A dog slept in the sun all day',
          'A boy ate five chocolates quickly',
          'She gave up after one failed attempt',
          'He quit the team when things got difficult',
          'The student stopped trying after getting confused',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The boy was resilient. Even after falling many times, he stood up and tried again.',
          'She showed resilience by continuing to practice despite many mistakes.',
          'The resilient athlete never gave up, even when injured.',
        ],
        correct: ['Kept trying', 'Never gave up', "Didn't quit"],
        options: [
          'Gave up',
          'Slept early',
          'Ran away',
          'Stopped trying',
          'Quit easily',
        ],
      },
    ],
  },
  {
    word: 'ABUNDANT',
    sentences: [
      {
        question: [
          'Which sentence shows something being abundant?',
          'Which example shows abundance?',
          'Where do you see something in abundance?',
        ],
        correct: [
          'The garden had plenty of flowers everywhere',
          'The market was overflowing with fresh fruits and vegetables',
          'Books filled every shelf and corner of the large library',
        ],
        options: [
          'There was only one apple left on the tree',
          'The library was empty and quiet',
          'She found a single coin in her pocket',
          'The store had very few items left',
          'Only a drop of water remained in the bottle',
          'The cupboard was nearly empty',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The forest was abundant with wildlife. Animals could be seen everywhere.',
          'The harvest was abundant this year. Farmers had more crops than ever.',
          'The ocean was abundant with fish. Fishermen caught more than expected.',
        ],
        correct: ['Plenty of', 'Lots of', 'Full of'],
        options: ['Very few', 'No sign of', 'Missing', 'Lacking', 'Empty of'],
      },
    ],
  },
  {
    word: 'METICULOUS',
    sentences: [
      {
        question: [
          'Which sentence shows someone being meticulous?',
          'Who is acting with meticulous attention?',
          'Which example shows meticulous behavior?',
        ],
        correct: [
          'Maya carefully checked every detail of her homework twice',
          'The artist spent hours perfecting each tiny brushstroke',
          'He organized his books by size, color, and subject perfectly',
        ],
        options: [
          'Tom quickly scribbled his answers without looking',
          'The chef cooked without measuring ingredients',
          'Sara rushed through her painting in five minutes',
          'She completed the task as fast as possible',
          'He did his work without checking for mistakes',
          'The student submitted the first draft without reviewing',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The scientist was meticulous in her research. She examined every piece of data carefully.',
          'The watchmaker was meticulous with each tiny gear. Nothing was left to chance.',
          'She was meticulous about cleaning. Every surface sparkled when finished.',
        ],
        correct: [
          'Very careful',
          'Extremely thorough',
          'Paid attention to details',
        ],
        options: ['Careless', 'Quick', 'Lazy', 'Sloppy', 'Rushed'],
      },
    ],
  },
  {
    word: 'ELOQUENT',
    sentences: [
      {
        question: [
          'Which sentence shows someone being eloquent?',
          'Who is speaking eloquently?',
          'Which example shows eloquent communication?',
        ],
        correct: [
          'The speaker used beautiful words that moved everyone',
          'The lawyer presented her case with grace and powerful language',
          'His graduation speech was so moving that many people cried',
        ],
        options: [
          'He mumbled and nobody could understand him',
          'She spoke so quietly that no one heard her',
          'The presentation was boring and unclear',
          'His words were confusing and hard to follow',
          'She struggled to express her thoughts clearly',
          'The speech was full of stammering and pauses',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The poet was eloquent in her speech. Her words flowed like music and touched hearts.',
          'The politician was eloquent during the debate. His arguments were clear and persuasive.',
          'She was eloquent in expressing her feelings. Everyone understood exactly what she meant.',
        ],
        correct: [
          'Spoke beautifully',
          'Expressed clearly',
          'Communicated powerfully',
        ],
        options: [
          'Spoke poorly',
          'Stayed silent',
          'Spoke angrily',
          'Mumbled quietly',
          'Spoke confusingly',
        ],
      },
    ],
  },
  {
    word: 'SERENE',
    sentences: [
      {
        question: [
          'Which sentence describes a serene place?',
          'Where would you find serenity?',
          'Which location sounds serene?',
        ],
        correct: [
          'The peaceful lake was calm and quiet in the morning',
          'The quiet garden was filled with gentle breezes and soft sunlight',
          'The meditation room was still and perfectly tranquil',
        ],
        options: [
          'The busy street was full of honking cars and noise',
          'The construction site was loud with machinery',
          'The playground was filled with shouting children',
          'The airport was crowded with rushing passengers',
          'The concert hall was filled with loud music and cheering',
          'The kitchen was busy with clattering pots and sizzling food',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The mountain top was serene. There was complete peace and tranquility.',
          'The library was serene in the early morning. Not a sound could be heard.',
          'Her face looked serene as she slept. All worry had disappeared.',
        ],
        correct: ['Peaceful', 'Calm', 'Tranquil'],
        options: ['Noisy', 'Chaotic', 'Busy', 'Loud', 'Hectic'],
      },
    ],
  },
  {
    word: 'INNOVATIVE',
    sentences: [
      {
        question: [
          'Which sentence shows someone being innovative?',
          'Who is being creative and innovative?',
          'Which example shows innovation?',
        ],
        correct: [
          'Lisa invented a new way to organize her books using colors',
          'The student created a unique app to help classmates study',
          'She designed a clever solution that no one had tried before',
        ],
        options: [
          'He did his homework the same way as always',
          'She copied exactly what her friend did',
          'The old method worked fine so they kept using it',
          'They followed the instructions step by step',
          'He used the same approach his teacher showed him',
          'She did everything exactly like the example',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The company was innovative in its approach. They created solutions that no one had thought of before.',
          'The artist was innovative with her paintings. She mixed techniques in ways never seen.',
          'His innovative design made the product much easier to use.',
        ],
        correct: ['Creative and new', 'Original', 'Inventive'],
        options: [
          'Old-fashioned',
          'Boring',
          'Traditional',
          'Ordinary',
          'Common',
        ],
      },
    ],
  },
  {
    word: 'TENACIOUS',
    sentences: [
      {
        question: [
          'Which sentence shows someone being tenacious?',
          'Who demonstrates tenacity?',
          'Which example shows tenacious behavior?',
        ],
        correct: [
          'Despite failing many times, Sam never gave up on his dream',
          'She kept trying to solve the puzzle for three hours straight',
          'Even after 20 rejections, he continued applying for his dream job',
        ],
        options: [
          'After one try, he decided it was too hard and quit',
          'She gave up as soon as things got difficult',
          'He stopped trying when his friends laughed at him',
          'The first obstacle made her change her mind',
          'When it got challenging, they found something easier to do',
          'He abandoned his goal after the first setback',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The athlete was tenacious in her training. She practiced every day no matter what obstacles came up.',
          'He was tenacious about learning guitar. Even with sore fingers, he practiced daily.',
          "The scientist was tenacious in her research. Years of failed experiments didn't stop her.",
        ],
        correct: ['Never gave up', 'Persisted', 'Kept going'],
        options: [
          'Gave up easily',
          'Was lazy',
          'Avoided challenges',
          'Quit quickly',
          'Stopped trying',
        ],
      },
    ],
  },
  {
    word: 'PRAGMATIC',
    sentences: [
      {
        question: [
          'Which sentence shows someone being pragmatic?',
          'Who is acting pragmatically?',
          'Which example shows pragmatic thinking?',
        ],
        correct: [
          'Instead of dreaming, Anna made a practical plan to save money',
          'He chose the job with good benefits rather than the exciting one',
          'She bought a reliable car instead of the fancy sports car',
        ],
        options: [
          'He spent all his time daydreaming about being rich',
          'She bought expensive things she could not afford',
          'They made unrealistic plans that could never work',
          'He ignored practical concerns and followed his heart',
          'She chose the option that looked the most impressive',
          'They focused on idealistic goals without considering reality',
        ],
      },
    ],
    contextChoice: [
      {
        sentence: [
          'The manager was pragmatic about the project. She focused on what could actually be done with the resources available.',
          'He was pragmatic about college choices. He picked the affordable school with good programs.',
          'The pragmatic approach helped them solve the problem quickly and efficiently.',
        ],
        correct: ['Practical', 'Realistic', 'Sensible'],
        options: [
          'Unrealistic',
          'Dreamy',
          'Idealistic',
          'Impractical',
          'Wishful',
        ],
      },
    ],
  },
];

export const sampleSpellingWords: WordDef[] = [
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

export const wordSequence: { mode: GameType; word: string }[] = [
  { mode: 'typingWithoutBox', word: 'CULTURE' },
  { mode: 'typingWithBox', word: 'DEFINITELY' },
  { mode: 'fourOption', word: 'OPINION' },
  { mode: 'jumbled', word: 'COUSIN' },
  { mode: 'typingWithoutBox', word: 'IMPRESS' },
  { mode: 'typingWithBox', word: 'ARRANGEMENT' },
  { mode: 'syllable', word: 'EXHAUST' },
  { mode: 'twoOption', word: 'MEMORABLE' },
  { mode: 'fourOption', word: 'SPECIAL' },
  { mode: 'jumbled', word: 'SYSTEM' },
  { mode: 'typingWithoutBox', word: 'RAINBOW' },
  { mode: 'typingWithBox', word: 'BUTTERFLY' },
  { mode: 'context', word: 'ELEPHANT' },
  { mode: 'correctSentence', word: 'TREASURE' },
];

export type GameSequenceType = {
  mode: GameType;
  def: WordDef | WordUsage;
  testTimerSeconds: number;
  isTestMode: boolean;
}[];

export const gameSequence: Promise<GameSequenceType> = Promise.resolve(
  (() => {
    const sequence: GameSequenceType = [];
    for (const item of wordSequence) {
      const wordDef = sampleSpellingWords.find(w => w.word === item.word);
      const wordUsage = sampleWordUsage.find(w => w.word === item.word);
      if (wordDef && !['context', 'correctSentence'].includes(item.mode)) {
        sequence.push({
          mode: item.mode,
          def: wordDef,
          testTimerSeconds: wordDef.word.length * 2,
          isTestMode: true,
        });
      } else if (wordUsage) {
        sequence.push({
          mode: item.mode,
          def: wordUsage,
          testTimerSeconds: 30,
          isTestMode: false,
        });
      }
    }
    return sequence as GameSequenceType;
  })()
);
