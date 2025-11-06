import TelegramBot from 'node-telegram-bot-api';

export const generateInlineTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string,
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): TelegramBot.InlineKeyboardButton[][] => {
  // [back, date, empty]
  // [evening, morning, afternoon] // [morning, afternoon, evening] // [afternoon, evening, morning]
  // [time1, time2] x 2

  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
  keyboard.push(...generateHeaders(parentId, selectedDate, groupSplitter));
  keyboard.push(...generateEmumCycles(parentId, selectedDate, groupSplitter));

  if (timeOfDay === 'morning') {
    keyboard.push(
      ...generateMorningTimerPicker(parentId, selectedDate, groupSplitter)
    );
  } else if (timeOfDay === 'afternoon') {
    keyboard.push(
      ...generateAfternoonTimerPicker(parentId, selectedDate, groupSplitter)
    );
  } else if (timeOfDay === 'evening') {
    keyboard.push(
      ...generateEveningTimerPicker(parentId, selectedDate, groupSplitter)
    );
  }

  return keyboard;
};

const generateHeaders = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
  // n_2026-10-06_0:::cmhltiz4u000byefvbd6ly83n
  keyboard.push([
    {
      text: '⬅️',
      callback_data: `t_${selectedDate}_back${groupSplitter}${parentId}`,
    },
    {
      text: selectedDate,
      callback_data: `t_${selectedDate}_back${groupSplitter}${parentId}`,
    },
    {
      text: ' ',
      callback_data: `t_${selectedDate}_back${groupSplitter}${parentId}`,
    },
  ]);
  return keyboard;
};

const generateEmumCycles = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
  keyboard.push([
    {
      text: 'Morning ☀️',
      callback_data: `pt_morning_${selectedDate}${groupSplitter}${parentId}`,
    },
    {
      text: 'Afternoon 🌤️',
      callback_data: `pt_afternoon_${selectedDate}${groupSplitter}${parentId}`,
    },
    {
      text: 'Evening 🌙',
      callback_data: `pt_evening_${selectedDate}${groupSplitter}${parentId}`,
    },
  ]);
  return keyboard;
};

const generateMorningTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
  keyboard.push(
    [
      {
        text: '☀️ 8a',
        callback_data: `t_08:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🌤️ 9a',
        callback_data: `t_09:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ],
    [
      {
        text: '🌞 10a',
        callback_data: `t_10:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🕚 11a',
        callback_data: `t_11:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ]
  );

  return keyboard;
};

const generateAfternoonTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
  keyboard.push(
    [
      {
        text: '🔆 noon',
        callback_data: `t_12:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🌇 1p',
        callback_data: `t_13:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ],
    [
      {
        text: '🌞 2p',
        callback_data: `t_14:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🕒 3p',
        callback_data: `t_15:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ]
  );

  return keyboard;
};

const generateEveningTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];
  keyboard.push(
    [
      {
        text: '🌤️ 4p',
        callback_data: `t_16:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🌇 5p',
        callback_data: `t_17:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ],
    [
      {
        text: '🌆 6p',
        callback_data: `t_18:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🌃 7p',
        callback_data: `t_19:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ],
    [
      {
        text: '🌙 8p',
        callback_data: `t_20:00_${selectedDate}${groupSplitter}${parentId}`,
      },
      {
        text: '🕘 9p',
        callback_data: `t_21:00_${selectedDate}${groupSplitter}${parentId}`,
      },
    ]
  );

  return keyboard;
};
