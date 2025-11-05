import TelegramBot from 'node-telegram-bot-api';

export abstract class TelegramBaseService {
  abstract isAuthRequired(body: TelegramBot.Update): boolean;
}
