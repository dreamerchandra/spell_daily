import TelegramBot from 'node-telegram-bot-api';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
export const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
  polling: false,
});

export const sendTelegramMessage = async (
  chatId: number | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
): Promise<TelegramBot.Message> => {
  logger.log('Sending Telegram message', {
    chatId,
    message: text,
    options: options ? JSON.stringify(options) : undefined,
  });

  try {
    const result = await bot.sendMessage(chatId, text, options);
    logger.debug('Telegram message sent successfully', {
      chatId,
      messageId: result.message_id,
    });
    return result;
  } catch (error) {
    logger.error('Failed to send Telegram message', error, {
      chatId,
      message: text,
    });
    throw error;
  }
};

export const sendTelegramSticker = async (
  chatId: number | string,
  sticker: string,
  options?: TelegramBot.SendStickerOptions
): Promise<TelegramBot.Message> => {
  logger.log('Sending Telegram sticker', { chatId, sticker, options });

  try {
    const result = await bot.sendSticker(chatId, sticker, options);
    logger.debug('Telegram sticker sent successfully', {
      chatId,
      messageId: result.message_id,
    });
    return result;
  } catch (error) {
    logger.error('Failed to send Telegram sticker', error, { chatId, sticker });
    throw error;
  }
};
