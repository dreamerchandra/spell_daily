import TelegramBot, { Update } from 'node-telegram-bot-api';
import { TelegramBaseService } from './telegram-base-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { FE_URL } from '../utils/fe-urls.js';

class TelegramLinkService extends TelegramBaseService {
  public hintMessage = '/link';

  canHandle(update: TelegramBot.Update): boolean {
    return update.message?.text === this.hintMessage;
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
            {
              text: 'All Users',
              web_app: {
                url: FE_URL.getAllUsersUrl(),
              },
            },
            {
              text: 'Report',
              web_app: {
                url: FE_URL.getReportUrl(),
              },
            },
          ],
        ],
      },
    });
  }
}

export const telegramLnkService = new TelegramLinkService();
