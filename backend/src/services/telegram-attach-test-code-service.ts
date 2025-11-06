import TelegramBot from 'node-telegram-bot-api';
import { getPhoneNumber } from '../utils/phone-number.js';
import { parentModel } from '../model/parent-model.js';
import { ensure } from '../types/ensure.js';
import { NotFoundError } from '../types/not-found-error.js';
import { sendTelegramMessage } from './telegram-bot-service.js';
import { testCodeModel } from '../model/test-code-model.js';
import { TelegramBaseService } from './telegram-base-service.js';

class TelegramAttachTestCodeService extends TelegramBaseService {
  hintMessage = '/add_test_code';
  canHandle(update: TelegramBot.Update): boolean {
    return this.canHandleMessage(update) || this.canHandleHintMessage(update);
  }
  async handle(update: TelegramBot.Update): Promise<void> {
    if (this.canHandleMessage(update)) {
      return await this.handleMessage(update);
    } else if (this.canHandleHintMessage(update)) {
      return await this.showAddTestCodeInfo(update.callback_query!.message!.chat.id);
    }
    return Promise.resolve();
  }
  canHandleMessage(body: TelegramBot.Update): boolean {
    const [phoneNumber, testCode] = body.message?.text?.split(' ') || ['', ''];
    return (
      getPhoneNumber(phoneNumber) !== null && typeof testCode === 'string' && testCode.length === 6
    );
  }
  isAuthRequired(): boolean {
    return true;
  }
  async handleMessage(body: TelegramBot.Update) {
    ensure(body.message, 'Message body is missing');
    const [_phoneNumber, testCode, name] = body.message?.text?.split(' ') || [];
    const phoneNumber = getPhoneNumber(_phoneNumber);
    ensure(phoneNumber, 'Phone number could not be extracted');
    try {
      const parent = await parentModel.findByPhoneNumber(phoneNumber);
      const result = await testCodeModel.createTestCode({
        testCode,
        parentId: parent.id,
        name,
      });
      sendTelegramMessage(
        body.message.chat.id,
        `Test code ${result.testCode} attached to parent ${parent.name} successfully.`
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        await sendTelegramMessage(body.message.chat.id, 'Parent not found');
      }
      await sendTelegramMessage(body.message.chat.id, 'Error retrieving parent information');
    }
  }
  canHandleHintMessage(body: TelegramBot.Update): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } {
    return !!body.callback_query?.data && body.callback_query.data === this.hintMessage;
  }
  async showAddTestCodeInfo(chatId: number) {
    const message =
      'Format: \n\n <phone_number> <test_code> <name_optional> \n\n Example: \n 8754xxxx AB12CD John Doe';
    await sendTelegramMessage(chatId, message);
  }
}

export const telegramAttachTestCodeService = new TelegramAttachTestCodeService();
