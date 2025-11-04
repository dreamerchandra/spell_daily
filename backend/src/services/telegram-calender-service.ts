import { bot } from './telegram-bot-service.js';
import Calendar from 'telegram-inline-calendar';
import type TelegramBot from 'node-telegram-bot-api';

const calendar = new Calendar(bot, {
  date_format: 'DD-MM-YYYY',
  language: 'en',
  start_date: 'now',
});

class TelegramCalenderService {
  canHandle = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & { message: TelegramBot.Message } => {
    if (!!body.message && body.message.text === '/calendar') {
      return true;
    }
    return false;
  };

  canHandleCallback = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery } => {
    const chatId = body.callback_query?.message?.chat?.id;
    const messageId = body.callback_query?.message?.message_id;

    if (chatId !== undefined && messageId !== undefined) {
      return messageId === calendar.chats.get(chatId);
    }
    return false;
  };

  canHandleNextButton = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery } => {
    //n_2025-11_++

    if (body.callback_query?.data?.endsWith('++') && body.callback_query?.data.startsWith('n_')) {
      return true;
    }
    return false;
  };

  canHandleBackButton = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery } => {
    //n_2025-11_--

    if (body.callback_query?.data?.endsWith('--') && body.callback_query?.data.startsWith('n_')) {
      return true;
    }
    return false;
  };

  handleCalender(message: TelegramBot.Message) {
    calendar.startNavCalendar(message);
  }

  handleNextButton(body: TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, date] = body.callback_query.data?.split('_') || [];
    const [year, month] = date.split('-').map(Number);
    bot.editMessageReplyMarkup(calendar.createNavigationKeyboard('en', new Date(year, month)), {
      chat_id: body.callback_query.message!.chat.id,
      message_id: body.callback_query.message!.message_id,
    });
  }

  handleBackButton(body: TelegramBot.Update & { callback_query: TelegramBot.CallbackQuery }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, date] = body.callback_query.data?.split('_') || [];
    const [year, month] = date.split('-').map(Number);
    const jsDate = new Date();
    jsDate.setFullYear(year);
    jsDate.setMonth(month - 2);
    bot.editMessageReplyMarkup(calendar.createNavigationKeyboard('en', jsDate), {
      chat_id: body.callback_query.message!.chat.id,
      message_id: body.callback_query.message!.message_id,
    });
  }
}

export const telegramCalenderService = new TelegramCalenderService();
