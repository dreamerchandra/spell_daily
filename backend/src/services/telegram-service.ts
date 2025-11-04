import TelegramBot from 'node-telegram-bot-api';
import { env } from '../config/env.js';
import { telegramParentService } from './telegram-parent-service.js';
import { telegramPhoneNumberService } from './telegram-phone-number-service.js';
import { telegramUpdateLeadService } from './telegram-update-lead-service.js';

export const bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
  polling: false,
});

class TelegramService {
  getUserId(body: TelegramBot.Update): number | null {
    if (body.message) {
      return body.message.from?.id || null;
    }
    if (body.callback_query) {
      return body.callback_query.from?.id || null;
    }
    if (body.inline_query) {
      return body.inline_query.from?.id || null;
    }
    if (body.chosen_inline_result) {
      return body.chosen_inline_result.from?.id || null;
    }
    if (body.shipping_query) {
      return body.shipping_query.from?.id || null;
    }
    if (body.pre_checkout_query) {
      return body.pre_checkout_query.from?.id || null;
    }
    return null;
  }

  async handleMessage(body: TelegramBot.Update) {
    if (body.message?.text?.startsWith('/add')) {
      await this.handleAddMessage(body.message);
    } else if (telegramParentService.canHandleCallback(body)) {
      await telegramParentService.showAddParentInfo(body.callback_query.from.id);
    } else if (telegramParentService.canHandleAddParent(body)) {
      await telegramParentService.handleAddParent(body);
    } else if (telegramPhoneNumberService.canHandleMessage(body)) {
      await telegramPhoneNumberService.handleMessage(body);
    } else if (telegramUpdateLeadService.canHandle(body)) {
      await telegramUpdateLeadService.handleUpdateLead(body);
    }
  }

  async handleAddMessage(message: TelegramBot.Message) {
    bot.sendMessage(message.chat.id, 'Message added successfully!', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Parent', callback_data: telegramParentService.hintMessage },
            { text: 'Admin', callback_data: '/add_admin' },
          ],
        ],
      },
    });
  }
}

export const telegramService = new TelegramService();
