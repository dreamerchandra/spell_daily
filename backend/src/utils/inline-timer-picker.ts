import TelegramBot from 'node-telegram-bot-api';
import { getNowIST } from './date.js';

export const generateInlineTimerPicker = (
  parentId: string,
  selectedDate: string, // YYYY-MM-DD
  groupSplitter: string,
  timeOfDay: 'morning' | 'afternoon' | 'evening'
): TelegramBot.InlineKeyboardButton[][] => {
  const keyboard: TelegramBot.InlineKeyboardButton[][] = [];

  // Build UI sections
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

  // ✅ Final filter to disable past dates & times
  return sanitizeKeyboard(keyboard, selectedDate);
};

function sanitizeKeyboard(
  keyboard: TelegramBot.InlineKeyboardButton[][],
  selectedDate: string
) {
  const today = getNowIST();
  today.setHours(0, 0, 0, 0);

  const selDate = new Date(selectedDate);
  selDate.setHours(0, 0, 0, 0);

  const isPastDate = selDate < today;

  return keyboard.map(row =>
    row.map(cell => {
      // Disable everything for past dates
      if (isPastDate) {
        return { text: ' ', callback_data: ' ' };
      }

      // Only sanitize buttons with times: t_HH:MM_YYYY-MM-DD
      if (!cell.callback_data?.startsWith('t_')) return cell;

      const parts = cell.callback_data.split('_'); // ["t", "HH:MM", "YYYY-MM-DD" ]
      if (parts.length < 3) return cell;

      const time = parts[1];
      const date = parts[2];

      // If callback date != selectedDate → leave it
      if (date !== selectedDate) return cell;

      // Parse time
      const [h, m] = time.split(':').map(Number);
      if (isNaN(h) || isNaN(m)) return cell;

      const now = getNowIST();

      // If today and time < now → disable
      if (selDate.getTime() === today.getTime()) {
        const buttonDateTime = getNowIST();
        buttonDateTime.setHours(h, m, 0, 0);

        if (buttonDateTime < now) {
          return { text: ' ', callback_data: ' ' };
        }
      }

      return cell;
    })
  );
}

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

function isTimePast(selectedDate: string, hhmm: string) {
  // selectedDate is "YYYY-MM-DD"
  const [year, month, day] = selectedDate.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);

  const candidate = new Date(year, month - 1, day, hh, mm, 0);
  const nowIST = getNowIST();

  return candidate < nowIST;
}

function timeButtonOrSkip(
  label: string,
  hhmm: string,
  selectedDate: string,
  parentId: string,
  groupSplitter: string
) {
  if (isTimePast(selectedDate, hhmm))
    return {
      text: ' ',
      callback_data: ' ',
    };

  return {
    text: label,
    callback_data: `t_${hhmm}_${selectedDate}${groupSplitter}${parentId}`,
  };
}

const generateMorningTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const rows: TelegramBot.InlineKeyboardButton[][] = [];

  const r1 = [
    timeButtonOrSkip('☀️ 8a', '08:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🌤️ 9a', '09:00', selectedDate, parentId, groupSplitter),
  ];

  const r2 = [
    timeButtonOrSkip('🌞 10a', '10:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🕚 11a', '11:00', selectedDate, parentId, groupSplitter),
  ];

  if (r1.length) rows.push(r1);
  if (r2.length) rows.push(r2);

  return rows;
};

const generateAfternoonTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const rows: TelegramBot.InlineKeyboardButton[][] = [];

  const r1 = [
    timeButtonOrSkip('🔆 noon', '12:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🌇 1p', '13:00', selectedDate, parentId, groupSplitter),
  ];

  const r2 = [
    timeButtonOrSkip('🌞 2p', '14:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🕒 3p', '15:00', selectedDate, parentId, groupSplitter),
  ];

  if (r1.length) rows.push(r1);
  if (r2.length) rows.push(r2);

  return rows;
};

const generateEveningTimerPicker = (
  parentId: string,
  selectedDate: string,
  groupSplitter: string
): TelegramBot.InlineKeyboardButton[][] => {
  const rows: TelegramBot.InlineKeyboardButton[][] = [];

  const r1 = [
    timeButtonOrSkip('🌤️ 4p', '16:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🌇 5p', '17:00', selectedDate, parentId, groupSplitter),
  ].filter(Boolean);

  const r2 = [
    timeButtonOrSkip('🌆 6p', '18:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🌃 7p', '19:00', selectedDate, parentId, groupSplitter),
  ].filter(Boolean);

  const r3 = [
    timeButtonOrSkip('🌙 8p', '20:00', selectedDate, parentId, groupSplitter),
    timeButtonOrSkip('🕘 9p', '21:00', selectedDate, parentId, groupSplitter),
  ].filter(Boolean);

  if (r1.length) rows.push(r1);
  if (r2.length) rows.push(r2);
  if (r3.length) rows.push(r3);

  return rows;
};
