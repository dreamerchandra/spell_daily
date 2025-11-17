import { Update } from 'node-telegram-bot-api';
import { TelegramBaseService } from './telegram-base-service.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { telegramService } from './telegram-service.js';
import { ensure } from '../types/ensure.js';
import { parentModel } from '../model/parent-model.js';
import { testCodeModel } from '../model/test-code-model.js';
import { FE_URL } from '../utils/fe-urls.js';

class TelegramSearchService extends TelegramBaseService {
  isAuthRequired(): boolean {
    return true;
  }

  canHandle(update: Update): boolean {
    return Boolean(update.message?.text);
  }

  async handle(update: Update): Promise<void> {
    const searchTeam = update.message?.text ?? '';
    const chatId = telegramService.getUserId(update);

    ensure(chatId, 'Chat Id not found in update');

    const testCode = await testCodeModel.getByTestCode(searchTeam);
    if (testCode?.parentId) {
      const parent = await parentModel.getById(testCode.parentId);
      ensure(parent, 'Parent not found for the test code');

      const messageText = [
        `👤 *${parent.name}*`,
        `📞 +91${parent.phoneNumber ?? 'No Phone'}`,
        parent.details.length ? `📝 ${parent.details.join(' ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await sendTelegramMessage(chatId, messageText, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'View Analytics',
                web_app: {
                  url: FE_URL.getAnalyticsForTestCode(testCode.testCode),
                },
              },
            ],
          ],
        },
        parse_mode: 'Markdown',
      });
      return;
    }

    const parents = await parentModel.searchByName(searchTeam);

    if (!parents.length) {
      await sendTelegramMessage(chatId, `No results for "${searchTeam}"`);
      return;
    }

    for (const parent of parents) {
      const messageText = [
        `👤 *${parent.name}*`,
        `📞 +91${parent.phoneNumber ?? 'No Phone'}`,
        parent.details.length ? `📝 ${parent.details.join(' ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      await sendTelegramMessage(chatId, messageText, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'View Students',
                web_app: {
                  url: FE_URL.getGenerateTestCodeUrl(parent.id),
                },
              },
            ],
          ],
        },
        parse_mode: 'Markdown',
      });
    }
  }
}

export const telegramSearchService = new TelegramSearchService();
