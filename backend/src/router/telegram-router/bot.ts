import TelegramBot from 'node-telegram-bot-api';
import { logger } from '../../lib/logger.js';
import { Request } from 'express';
import { telegramService } from '../../services/telegram-service.js';
import { bot } from '../../services/telegram-bot-service.js';

export const asTelegramRequest = (req: Request): TelegramBot.Update | null => {
  if (typeof req !== 'object' || req === null) {
    return null;
  }

  const update = req.body as TelegramBot.Update;

  if (
    update.message ||
    update.callback_query ||
    update.inline_query ||
    update.chosen_inline_result ||
    update.shipping_query ||
    update.pre_checkout_query ||
    update.poll ||
    update.poll_answer
  ) {
    return update;
  }
  return null;
};

export const handleMessage = async (body: TelegramBot.Update) => {
  const chatId = telegramService.getUserId(body);

  logger.log('Received Telegram message', {
    chatId,
  });

  try {
    bot.sendMessage(chatId!, 'Processing your request...');
    await telegramService.handleMessage(body);
    logger.debug('Sent reply to admin', { chatId });
  } catch (error) {
    logger.error('Failed to send Telegram message', error, { chatId });
  }
};
