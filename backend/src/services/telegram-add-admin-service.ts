import TelegramBot from 'node-telegram-bot-api';
import { adminUserModel } from '../model/admin-user-model.js';
import { otpUserModel } from '../model/otp-user-model.js';
import { ensure } from '../types/ensure.js';
import { TelegramBaseService } from './telegram-base-service.js';
import { logger } from '../lib/logger.js';
import { sendTelegramMessage } from './telegram-bot-service.js';

class TelegramAddAdminService extends TelegramBaseService {
  async addAdmin(code: string, telegramId: string) {
    const otpRecord = await otpUserModel.findByCode(code);
    ensure(otpRecord, 'Invalid or expired OTP code');

    await adminUserModel.createAdminUser(telegramId);
    await otpUserModel.deleteByCode(code);
  }
  isAuthRequired(): boolean {
    return false;
  }
  canHandle(update: TelegramBot.Update): boolean {
    return this.canHandleAddAdmin(update);
  }
  async handle(update: TelegramBot.Update): Promise<void> {
    if (this.canHandleAddAdmin(update)) {
      await this.handleAddAdmin(update);
    }
  }

  canHandleAddAdmin(
    body: TelegramBot.Update
  ): body is TelegramBot.Update & { message: TelegramBot.Message } {
    if (body.message?.text?.startsWith('otp_')) {
      const parts = body.message.text.split('_');
      const [, otpCode] = parts;
      return Number.isInteger(parseInt(otpCode));
    }
    return false;
  }

  async handleAddAdmin(body: TelegramBot.Update & { message: TelegramBot.Message }) {
    const parts = body.message.text?.split('_');
    const [, otpCode] = parts ?? [];
    const telegramId = body.message.chat.id.toString();

    await this.addAdmin(otpCode, telegramId);
    logger.log(`Added new admin with Telegram ID: ${telegramId} with otp: ${otpCode}`);
    sendTelegramMessage(body.message.chat.id, 'Welcome to spell daily! You are now an admin.');
  }
}

export const telegramAddAdminService = new TelegramAddAdminService();
