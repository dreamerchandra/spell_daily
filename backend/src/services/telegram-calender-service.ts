import { bot } from './telegram-bot-service.js';
import Calendar from 'telegram-inline-calendar';
import type TelegramBot from 'node-telegram-bot-api';
import { TelegramBaseService } from './telegram-base-service.js';
import { telegramTimePickerService } from './telegram-time-picker-service.js';

class TelegramCalenderService extends TelegramBaseService {
  groupSeparator = ':::';

  isAuthRequired(): boolean {
    return false;
  }

  private getHandleType(body: TelegramBot.Update): string | null {
    if (body.message?.text === '/calendar') return 'calendar';
    if (this.canHandleNextButton(body)) return 'next';
    if (this.canHandleBackButton(body)) return 'back';
    if (this.canHandleDateSelection(body)) return 'date';
    if (this.canHandleTimeBackButton(body)) return 'timeBack';
    return null;
  }

  canHandle = (body: TelegramBot.Update): boolean => {
    return this.getHandleType(body) !== null;
  };

  async handle(body: TelegramBot.Update): Promise<void> {
    const type = this.getHandleType(body);
    switch (type) {
      case 'calendar':
        return this.handleCalendar(body.message!.chat.id);
      case 'next':
        return this.handleNextButton(
          body as TelegramBot.Update & {
            callback_query: TelegramBot.CallbackQuery;
          }
        );
      case 'back':
        return this.handleBackButton(
          body as TelegramBot.Update & {
            callback_query: TelegramBot.CallbackQuery;
          }
        );
      case 'date':
        return this.handleDateSelection(
          body as TelegramBot.Update & {
            callback_query: TelegramBot.CallbackQuery;
          }
        );
      case 'timeBack':
        return this.handleTimeBackButton(
          body as TelegramBot.Update & {
            callback_query: TelegramBot.CallbackQuery;
          }
        );
      default:
        return;
    }
  }

  // 🔹 Determines if callback belongs to this calendar
  canHandleCallback = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } => {
    const calendar = new Calendar(bot, {
      date_format: 'DD-MM-YYYY',
      language: 'en',
      start_date: 'now',
      time_step: '1h',
    });
    const chatId = body.callback_query?.message?.chat?.id;
    const messageId = body.callback_query?.message?.message_id;
    return (
      chatId !== undefined &&
      messageId !== undefined &&
      messageId === calendar.chats.get(chatId)
    );
  };

  // 🔹 Handlers for types of callbacks
  canHandleNextButton = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } => {
    const [data] = body.callback_query?.data?.split(this.groupSeparator) || [];
    return data?.startsWith('n_') && data.endsWith('++');
  };

  canHandleBackButton = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } => {
    const [data] = body.callback_query?.data?.split(this.groupSeparator) || [];
    return data?.startsWith('n_') && data.endsWith('--');
  };

  canHandleDateSelection = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } => {
    const [data] = body.callback_query?.data?.split(this.groupSeparator) || [];
    return data?.startsWith('n_') && data.endsWith('_0');
  };

  canHandleTimeBackButton = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } => {
    const [data] = body.callback_query?.data?.split(this.groupSeparator) || [];
    return data?.startsWith('t_') && data.endsWith('_back');
  };

  disablePastDates(inlineKeyboard: any[][]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    return inlineKeyboard.map(row =>
      row.map(cell => {
        // No date → return as-is
        if (!cell.callback_data || !cell.callback_data.includes('_'))
          return cell;

        // callback_data format: n_2025-11-06_0
        const parts = cell.callback_data.split('_');
        if (parts.length < 2) return cell;

        const dateStr = parts[1]; // "2025-11-06"
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return cell;

        // Check if it’s yesterday or older
        if (date < today) {
          return {
            text: ' ',
            callback_data: ' ',
          };
        }

        // Otherwise return the valid date button
        return cell;
      })
    );
  }

  // 🔹 Creates calendar message (entry point)
  async handleCalendar(chatId: number, parentId: string | null = null) {
    const stateDate = new Date();
    const calendar = new Calendar(bot, {
      date_format: 'DD-MM-YYYY',
      language: 'en',
      start_date: stateDate.toDateString(),
      time_step: '1h',
    });
    const inlineKeyboard = calendar.createNavigationKeyboard('en', stateDate);
    const modifiedKeyboard = this.injectParentId(
      inlineKeyboard.inline_keyboard,
      parentId
    );
    const hidingPastDatesKeyboard = this.disablePastDates(modifiedKeyboard);

    await bot.sendMessage(chatId, 'Please select a date:', {
      reply_markup: { inline_keyboard: hidingPastDatesKeyboard },
    });
  }

  // 🔹 Adds :::parentId to every button
  private injectParentId(
    keyboard: TelegramBot.InlineKeyboardButton[][],
    parentId: string | null
  ) {
    if (!parentId) return keyboard;
    return keyboard.map(row =>
      row.map(button => ({
        ...button,
        callback_data: `${button.callback_data}${this.groupSeparator}${parentId}`,
      }))
    );
  }

  async handleNextButton(
    body: TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery }
  ) {
    const [calendarData, parentId] =
      body.callback_query.data?.split(this.groupSeparator) || [];
    const [, date] = calendarData.split('_');
    const [year, month] = date.split('-').map(Number);
    const calendar = new Calendar(bot, {
      date_format: 'DD-MM-YYYY',
      language: 'en',
      start_date: 'now',
      time_step: '1h',
    });
    const newKeyboard = this.injectParentId(
      calendar.createNavigationKeyboard('en', new Date(year, month))
        .inline_keyboard,
      parentId
    );

    await bot.editMessageReplyMarkup(
      { inline_keyboard: newKeyboard },
      {
        chat_id: body.callback_query.message!.chat.id,
        message_id: body.callback_query.message!.message_id,
      }
    );
  }

  async handleBackButton(
    body: TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery }
  ) {
    const [calendarData, parentId] =
      body.callback_query.data?.split(this.groupSeparator) || [];
    const [, date] = calendarData.split('_');
    const [year, month] = date.split('-').map(Number);
    const jsDate = new Date(year, month - 2);
    const calendar = new Calendar(bot, {
      date_format: 'DD-MM-YYYY',
      language: 'en',
      start_date: 'now',
      time_step: '1h',
    });
    const newKeyboard = this.injectParentId(
      calendar.createNavigationKeyboard('en', jsDate).inline_keyboard,
      parentId
    );

    await bot.editMessageReplyMarkup(
      { inline_keyboard: newKeyboard },
      {
        chat_id: body.callback_query.message!.chat.id,
        message_id: body.callback_query.message!.message_id,
      }
    );
  }

  async handleDateSelection(
    body: TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery }
  ) {
    const chatId = body.callback_query.message!.chat.id;
    const message_id = body.callback_query.message!.message_id;
    const [calendarData, parentId] =
      body.callback_query.data?.split(this.groupSeparator) || [];
    const [, date] = calendarData.split('_');
    const [year, month, day] = date.split('-').map(Number);
    const jsDate = new Date(year, month - 1, day);
    const formattedYear = jsDate.getFullYear();
    const formattedMonth = (jsDate.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = jsDate.getDate().toString().padStart(2, '0');
    await telegramTimePickerService.triggerTime(
      chatId,
      message_id,
      parentId,
      `${formattedYear}-${formattedMonth}-${formattedDay}`
    );
  }

  async handleTimeBackButton(
    body: TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery }
  ) {
    const [calendarData, parentId] =
      body.callback_query.data?.split(this.groupSeparator) || [];
    const [, date] = calendarData.split('_');
    const [year, month, day] = date.split('-').map(Number);
    const jsDate = new Date(year, month - 1, day);
    const calendar = new Calendar(bot, {
      date_format: 'DD-MM-YYYY',
      language: 'en',
      start_date: 'now',
      time_step: '1h',
    });
    const newKeyboard = this.injectParentId(
      calendar.createNavigationKeyboard('en', jsDate).inline_keyboard,
      parentId
    );

    await bot.editMessageReplyMarkup(
      { inline_keyboard: newKeyboard },
      {
        chat_id: body.callback_query.message!.chat.id,
        message_id: body.callback_query.message!.message_id,
      }
    );
  }
}

export const telegramCalenderService = new TelegramCalenderService();
