import { generateInlineTimerPicker } from '../utils/inline-timer-picker.js';
import { telegramCalenderService } from './telegram-calender-service.js';
import { bot } from './telegram-bot-service.js';
import { TelegramBaseService } from './telegram-base-service.js';
import { InlineKeyboardButton, Update } from 'node-telegram-bot-api';
import { ensure } from '../types/ensure.js';
import { remainderService } from './remainder-service.js';
import { parentModel } from '../model/parent-model.js';

class TelegramTimePickerService extends TelegramBaseService {
  bot = bot;

  async triggerTime(
    chatId: number,
    message_id: number,
    parentId: string,
    date: string,
    timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning'
  ) {
    const keyboard = generateInlineTimerPicker(
      parentId,
      date,
      telegramCalenderService.groupSeparator,
      timeOfDay
    );

    await this.bot.editMessageReplyMarkup(
      {
        inline_keyboard: keyboard,
      },
      {
        chat_id: chatId,
        message_id: message_id,
      }
    );
  }

  async sendTimePicker(
    chatId: number,
    message_id: number,
    keyboard: InlineKeyboardButton[][]
  ) {
    await this.bot.editMessageReplyMarkup(
      {
        inline_keyboard: keyboard,
      },
      {
        chat_id: chatId,
        message_id: message_id,
      }
    );
  }

  isAuthRequired(): boolean {
    return true;
  }

  canHandle(body: Update): boolean {
    const [payload, parentId] = body.callback_query?.data?.split(
      telegramCalenderService.groupSeparator
    ) ?? ['', ''];
    const [action] = payload.split('_');
    return ['t', 'pt'].includes(action) && !!parentId;
  }

  handle(update: Update): Promise<void> {
    return this.handleCallback(update);
  }

  async handleCallback(body: Update): Promise<void> {
    const data = body.callback_query?.data;
    const chatId = body.callback_query?.message?.chat?.id;
    const callbackQueryId = body.callback_query?.id;
    ensure(chatId, 'Chat ID is required');
    ensure(data, 'Callback data is required');

    const [payload, parentId] = data.split(
      telegramCalenderService.groupSeparator
    );
    const [action, value, selectedDate] = payload.split('_');

    switch (action) {
      case 'pt': {
        const keyboard = generateInlineTimerPicker(
          parentId,
          selectedDate,
          telegramCalenderService.groupSeparator,
          value as 'morning' | 'afternoon' | 'evening'
        );
        await this.sendTimePicker(
          chatId,
          body.callback_query!.message!.message_id,
          keyboard
        );
        break;
      }
      case 't': {
        // A specific time selected
        const selectedTime = value;
        if (callbackQueryId) {
          await this.bot.answerCallbackQuery(callbackQueryId, {
            text: `You selected ${selectedTime}`,
          });
        }
        const [year, month, day] = selectedDate.split('-').map(Number);
        const formattedDateString = `${year}-${month}-${day}`;
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const formattedTimeString = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:00`;
        const selectedLocal = `${formattedDateString}T${formattedTimeString}+05:30`;
        const parent = await parentModel.getById(parentId);

        await remainderService.scheduleReminders({
          dateTime: selectedLocal,
          userId: chatId.toString(),
          message: `You can set a remainder for name: ${parent.name} phoneNumber: ${parent.phoneNumber}`,
        });

        await this.bot.sendMessage(
          chatId,
          `✅ Remainder set for ${selectedDate} at ${selectedTime} for ${parent.name}.`
        );

        // you can handle persistence or trigger next flow here
        break;
      }

      default:
        if (callbackQueryId) {
          await this.bot.answerCallbackQuery(callbackQueryId, {
            text: 'Unknown action',
          });
        }
    }
  }
}

export const telegramTimePickerService = new TelegramTimePickerService();
