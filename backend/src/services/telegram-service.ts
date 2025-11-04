import TelegramBot from 'node-telegram-bot-api';
import { telegramParentService } from './telegram-parent-service.js';
import { telegramPhoneNumberService } from './telegram-phone-number-service.js';
import { telegramUpdateLeadService } from './telegram-update-lead-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { telegramAttachTestCodeService } from './telegram-attach-test-code-service.js';
import { telegramCalenderService } from './telegram-calender-service.js';

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
    }
    if (telegramParentService.canHandleCallback(body)) {
      await telegramParentService.showAddParentInfo(body.callback_query.from.id);
    }
    if (telegramParentService.canHandleAddParent(body)) {
      await telegramParentService.handleAddParent(body);
    }
    if (telegramPhoneNumberService.canHandleMessage(body)) {
      await telegramPhoneNumberService.handleMessage(body);
    }
    if (telegramUpdateLeadService.canHandle(body)) {
      await telegramUpdateLeadService.handleUpdateLead(body);
    }
    if (telegramAttachTestCodeService.canHandleMessage(body)) {
      await telegramAttachTestCodeService.handleMessage(body);
    }
    if (telegramAttachTestCodeService.canHandleHintMessage(body)) {
      await telegramAttachTestCodeService.showAddTestCodeInfo(body.callback_query.from.id);
    }
    if (telegramCalenderService.canHandle(body)) {
      telegramCalenderService.handleCalender(body.message!);
    }
    if (telegramCalenderService.canHandleNextButton(body)) {
      telegramCalenderService.handleNextButton(body);
    }
    if (telegramCalenderService.canHandleBackButton(body)) {
      telegramCalenderService.handleBackButton(body);
    }
  }

  async handleAddMessage(message: TelegramBot.Message) {
    await sendTelegramMessage(message.chat.id, 'Message added successfully!', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Parent', callback_data: telegramParentService.hintMessage },
            { text: 'Test Code', callback_data: telegramAttachTestCodeService.hintMessage },
          ],
        ],
      },
    });
  }
}

export const telegramService = new TelegramService();
