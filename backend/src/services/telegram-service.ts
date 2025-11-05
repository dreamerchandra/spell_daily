import TelegramBot from 'node-telegram-bot-api';
import { telegramParentService } from './telegram-parent-service.js';
import { telegramPhoneNumberService } from './telegram-phone-number-service.js';
import { telegramUpdateLeadService } from './telegram-update-lead-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { telegramAttachTestCodeService } from './telegram-attach-test-code-service.js';
import { telegramCalenderService } from './telegram-calender-service.js';
import { telegramAddAdminService } from './telegram-add-admin-service.js';
import { TelegramBaseService } from './telegram-base-service.js';

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
    if (telegramAddAdminService.canHandleAddAdmin(body)) {
      return telegramAddAdminService.isAuthRequired();
    }
    if (telegramParentService.canHandleCallback(body)) {
      return telegramParentService.isAuthRequired();
    }
    if (telegramParentService.canHandleAddParent(body)) {
      return telegramParentService.isAuthRequired();
    }
    if (telegramPhoneNumberService.canHandleMessage(body)) {
      return telegramPhoneNumberService.isAuthRequired();
    }
    if (telegramUpdateLeadService.canHandle(body)) {
      return telegramUpdateLeadService.isAuthRequired();
    }
    if (telegramAttachTestCodeService.canHandleMessage(body)) {
      return telegramAttachTestCodeService.isAuthRequired();
    }
    if (telegramAttachTestCodeService.canHandleHintMessage(body)) {
      return telegramAttachTestCodeService.isAuthRequired();
    }
    if (telegramCalenderService.canHandle(body)) {
      return telegramCalenderService.isAuthRequired();
    }
    if (telegramCalenderService.canHandleNextButton(body)) {
      return telegramCalenderService.isAuthRequired();
    }
    if (telegramCalenderService.canHandleBackButton(body)) {
      return telegramCalenderService.isAuthRequired();
    }
    if (telegramCalenderService.canHandleDateSelection(body)) {
      return telegramCalenderService.isAuthRequired();
    }
    if (telegramCalenderService.canHandleTimeBackButton(body)) {
      return telegramCalenderService.isAuthRequired();
    }
    if (telegramAddAdminService.canHandleAddAdmin(body)) {
      return telegramAddAdminService.isAuthRequired();
    }
    return false;
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
    if (telegramCalenderService.canHandleDateSelection(body)) {
      telegramCalenderService.handleDateSelection(body);
    }
    if (telegramCalenderService.canHandleTimeBackButton(body)) {
      telegramCalenderService.handleTimeBackButton(body);
    }
    if (telegramAddAdminService.canHandleAddAdmin(body)) {
      await telegramAddAdminService.handleAddAdmin(body);
    }
  }

  async handleAddMessage(message: TelegramBot.Message) {
    await sendTelegramMessage(message.chat.id, 'Choose one!', {
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
