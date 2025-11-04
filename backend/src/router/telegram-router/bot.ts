import TelegramBot from 'node-telegram-bot-api';
import { env } from '../../config/env.js';
import { logger } from '../../lib/logger.js';
import { Request } from 'express';

export const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
  polling: false,
});

export const asTelegramRequest = (req: Request): TelegramBot.Update | null => {
  if (typeof req !== 'object' || req === null) {
    return null;
  }

  const update = req.body as TelegramBot.Update;

  if (update.message) {
    return update;
  }
  return null;
};

export const handleMessage = async (message: TelegramBot.Message) => {
  const chatId = message.chat.id;
  const text = message.text;

  logger.log('Received Telegram message', {
    chatId,
    text,
    from: message.from?.username,
    userId: message.from?.id,
  });

  const fromUser = message.from?.first_name;
  try {
    const response = `Hello ${fromUser || 'Admin'}! You said: ${text}`;
    await bot.sendMessage(chatId, response);
    logger.debug('Sent reply to admin', { chatId, adminId: message.from?.id });
  } catch (error) {
    logger.error('Failed to send Telegram message', error, { chatId });
  }
};
