import TelegramBot from 'node-telegram-bot-api';

export abstract class TelegramBaseService {
  abstract isAuthRequired(body: TelegramBot.Update): boolean;
  abstract canHandle(update: TelegramBot.Update): boolean;
  abstract handle(update: TelegramBot.Update): Promise<void>;
}
