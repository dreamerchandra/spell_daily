import { parentModel, ParentUser } from '../model/parent-model.js';
import { UniqueConstraintError } from '../types/unique-constrain-error.js';
import TelegramBot from 'node-telegram-bot-api';
import { getPhoneNumber } from '../utils/phone-number.js';
import { ensure } from '../types/ensure.js';
import { telegramUpdateLeadService } from './telegram-update-lead-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { TelegramBaseService } from './telegram-base-service.js';
class TelegramParentService extends TelegramBaseService {
  public hintMessage = '/show_parent_hint';
  private parentMessageInfo =
    'Ok! Send me parent details in this format: \n \n Parent \n 8754xxxx \n Name \n other details \n';

  async showAddParentInfo(chatId: number) {
    await sendTelegramMessage(chatId, this.parentMessageInfo);
  }

  canHandleCallback = (
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } => {
    return (
      !!body.callback_query?.data &&
      body.callback_query.data === this.hintMessage
    );
  };
  canHandle(update: TelegramBot.Update): boolean {
    return this.canHandleCallback(update) || this.canHandleAddParent(update);
  }

  handle(update: TelegramBot.Update): Promise<void> {
    if (this.canHandleCallback(update)) {
      return this.showAddParentInfo(update.callback_query!.message!.chat.id);
    } else if (this.canHandleAddParent(update)) {
      return this.handleAddParent(update);
    }
    return Promise.resolve();
  }

  isAuthRequired(): boolean {
    return true;
  }

  canHandleAddParent(body: TelegramBot.Update) {
    if (body.message?.text) {
      if (
        body.message.reply_to_message?.text
          ?.replaceAll('\n', '')
          .replaceAll(' ', '') ===
        this.parentMessageInfo.replaceAll('\n', '').replaceAll(' ', '')
      ) {
        return true;
      }
      const lines = body.message.text.split('\n').map(line => line.trim());
      return lines[0].toLowerCase() === 'parent' && lines.length >= 2;
    }
    return false;
  }

  getParentDetails(body: TelegramBot.Update): ParentUser | null {
    if (body.message?.text) {
      const lines = body.message.text.split('\n').map(line => line.trim());
      const trimFirstLineIfNeeded =
        lines[0].toLowerCase() === 'parent' ? lines.slice(1) : lines;
      if (lines.length >= 2) {
        const phoneNumber = getPhoneNumber(trimFirstLineIfNeeded[0]);
        if (!phoneNumber) return null;
        return {
          phoneNumber: phoneNumber,
          name: trimFirstLineIfNeeded[1],
          details: trimFirstLineIfNeeded.slice(2).join(' '),
        };
      }
    }
    return null;
  }

  handleAddParent = async (body: TelegramBot.Update) => {
    const chatId = body.message!.chat.id;
    const parentDetails = this.getParentDetails(body);
    ensure(parentDetails, 'Parent details could not be extracted');
    try {
      await parentModel.createParent(parentDetails);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintError) {
        const parent = await parentModel.findByPhoneNumber(
          parentDetails.phoneNumber
        );
        telegramUpdateLeadService.triggerFlow(body, parent);
      } else {
        await sendTelegramMessage(
          chatId,
          'Failed to add parent. Please try again later.'
        );
      }
      return;
    }
    await sendTelegramMessage(
      chatId,
      `Parent added successfully!\n\nPhone: ${parentDetails.phoneNumber}\nName: ${parentDetails.name || 'N/A'}\nDetails: ${parentDetails.details || 'N/A'}`
    );
  };
}

export const telegramParentService = new TelegramParentService();
