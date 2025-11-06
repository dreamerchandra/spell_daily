import { Update } from 'node-telegram-bot-api';
import { TelegramBaseService } from './telegram-base-service.js';
import TelegramBot from 'node-telegram-bot-api';
import { telegramParentService } from './telegram-parent-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { telegramAttachTestCodeService } from './telegram-attach-test-code-service.js';

class TelegramAddService extends TelegramBaseService {
  public hintMessage = '/add';

  canHandle(update: TelegramBot.Update): boolean {
    if (update.message?.text?.startsWith(this.hintMessage)) {
      return true;
    }
    return false;
  }
  isAuthRequired(): boolean {
    return false;
  }
  async handle(update: Update): Promise<void> {
    const message = update.message;
    if (!message) return;

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

export const telegramAddService = new TelegramAddService();
