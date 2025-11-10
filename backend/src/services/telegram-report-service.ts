import TelegramBot from 'node-telegram-bot-api';
import { TelegramBaseService } from './telegram-base-service.js';
import { testCodeModel } from '../model/test-code-model.js';
import { asyncContext } from '../lib/asyncContext.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { telegramService } from './telegram-service.js';
import { ensure } from '../types/ensure.js';
import { env } from '../config/env.js';

function formatDateDDMMYYYY(date: Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const getReportUrl = (): string => {
  const feUrl = env.TELEGRAM_FE_URL;
  return `${feUrl}/`;
};

const getUserString = (user: {
  name?: string;
  parentName?: string;
  testCode?: string;
  phoneNumber?: string;
  lastCompletedDate: Date | null;
}): string => {
  const phone = user.phoneNumber ?? 'N/A';

  return `Name: ${user.name ?? 'N/A'}
Parent: ${user.parentName ?? 'N/A'}
Test Code: ${user.testCode ?? 'N/A'}
Phone: +91${phone}
Last Completed Date: ${
    user.lastCompletedDate ? formatDateDDMMYYYY(user.lastCompletedDate) : 'N/A'
  }`;
};

class TelegramReportService extends TelegramBaseService {
  isAuthRequired(): boolean {
    return true;
  }
  canHandle(update: TelegramBot.Update): boolean {
    if (!update.message) {
      return false;
    }
    return update.message.text?.includes('report') ?? false;
  }
  async handle(update: TelegramBot.Update): Promise<void> {
    const currentAdminId = asyncContext.getTelegramAdminUser()?.id;
    const dictUsers = await testCodeModel.getDormantUsers(
      {
        lastAccess: 0 as unknown as Date,
        status: 'DICTATION',
      },
      currentAdminId
    );
    const freeTrialUsers = await testCodeModel.getDormantUsers(
      {
        lastAccess: 0 as unknown as Date,
        status: 'FREE_TRIAL',
      },
      currentAdminId
    );

    const paidUsers = await testCodeModel.getDormantUsers(
      {
        lastAccess: 1 as unknown as Date,
        status: 'PAID',
      },
      currentAdminId
    );

    let report = `Dormant Users Report:\n\n`;

    report += `=== DICTATION USERS ===\n`;
    report += dictUsers.length
      ? dictUsers.map(getUserString).join('\n\n')
      : 'None';
    report += `\n\n`;

    report += `=== FREE TRIAL USERS ===\n`;
    report += freeTrialUsers.length
      ? freeTrialUsers.map(getUserString).join('\n\n')
      : 'None';
    report += `\n\n`;

    report += `=== PAID USERS ===\n`;
    report += paidUsers.length
      ? paidUsers.map(getUserString).join('\n\n')
      : 'None';
    report += `\n\n`;

    const chatId = telegramService.getUserId(update);
    ensure(chatId, 'Chat ID not found in the update');

    await sendTelegramMessage(chatId, report, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Refresh Report', web_app: { url: getReportUrl() } }],
        ],
      },
    });
  }
}

export const telegramReportService = new TelegramReportService();
