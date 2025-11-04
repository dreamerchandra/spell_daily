import TelegramBot from 'node-telegram-bot-api';
import { getPhoneNumber } from '../utils/phone-number.js';
import { parentModel } from '../model/parent-model.js';
import { ensure } from '../types/ensure.js';
import { bot } from './telegram-service.js';
import { NotFoundError } from '../types/not-found-error.js';
import { telegramUpdateLeadService } from './telegram-update-lead-service.js';

class TelegramPhoneNumber {
  canHandleMessage(body: TelegramBot.Update): boolean {
    return getPhoneNumber(body.message?.text || '') !== null;
  }
  async handleMessage(body: TelegramBot.Update) {
    ensure(body.message, 'Message body is missing');
    const phoneNumber = getPhoneNumber(body.message.text || '');
    ensure(phoneNumber, 'Phone number could not be extracted');
    try {
      const parent = await parentModel.findByPhoneNumber(phoneNumber);
      telegramUpdateLeadService.triggerFlow(body, parent);
    } catch (error) {
      if (error instanceof NotFoundError) {
        bot.sendMessage(body.message.chat.id, 'Parent not found');
      }
      bot.sendMessage(body.message.chat.id, 'Error retrieving parent information');
    }
  }
}

export const telegramPhoneNumberService = new TelegramPhoneNumber();
