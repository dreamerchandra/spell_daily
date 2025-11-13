import { Update } from 'node-telegram-bot-api';
import { TelegramBaseService } from './telegram-base-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { adminUserModel } from '../model/admin-user-model.js';
import { telegramService } from './telegram-service.js';
import { ensure } from '../types/ensure.js';

class TelegramTokenService extends TelegramBaseService {
  hintMessage = '/token';
  isAuthRequired(): boolean {
    return true;
  }
  canHandle(update: Update): boolean {
    if (update.message?.text) {
      return update.message.text.trim() === this.hintMessage;
    }
    return false;
  }
  async handle(update: Update): Promise<void> {
    const userId = telegramService.getUserId(update);
    ensure(userId, 'Telegram user ID is missing');
    const token = await adminUserModel.createJWTToken(userId);
    await sendTelegramMessage(userId, `Your JWT token is: ${token}`, {
      parse_mode: 'HTML',
    });
    return Promise.resolve();
  }
}

export const telegramTokenService = new TelegramTokenService();
