import TelegramBot from 'node-telegram-bot-api';
import { telegramParentService } from './telegram-parent-service.js';
import { telegramPhoneNumberService } from './telegram-phone-number-service.js';
import { telegramUpdateLeadService } from './telegram-update-lead-service.js';
import { telegramAttachTestCodeService } from './telegram-attach-test-code-service.js';
import { telegramCalenderService } from './telegram-calender-service.js';
import { telegramAddAdminService } from './telegram-add-admin-service.js';
import { TelegramBaseService } from './telegram-base-service.js';
import { telegramAddService } from './telegram-add-service.js';
import { telegramTimePickerService } from './telegram-time-picker-service.js';
import { telegramReportService } from './telegram-report-service.js';

const handlers: TelegramBaseService[] = [
  telegramAddService,
  telegramParentService,
  telegramReportService,
  telegramPhoneNumberService,
  telegramUpdateLeadService,
  telegramAttachTestCodeService,
  telegramCalenderService,
  telegramAddAdminService,
  telegramTimePickerService,
];

class TelegramService extends TelegramBaseService {
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

  isAuthRequired(body: TelegramBot.Update): boolean {
    const handler = handlers.find(handler => handler.canHandle(body));
    return handler ? handler.isAuthRequired(body) : false;
  }

  canHandle(update: TelegramBot.Update): boolean {
    return handlers.some(handler => handler.canHandle(update));
  }

  async handle(update: TelegramBot.Update): Promise<void> {
    const handler = handlers.find(handler => handler.canHandle(update));
    if (handler) {
      return await handler.handle(update);
    }
    return Promise.resolve();
  }
}

export const telegramService = new TelegramService();
