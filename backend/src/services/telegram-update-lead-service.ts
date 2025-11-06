import TelegramBot from 'node-telegram-bot-api';
import { parentModel, ParentUserResponse } from '../model/parent-model.js';
import { ensure } from '../types/ensure.js';
import { LeadStatus } from '../model/parent-lead-model.js';
import { leadStatusConverter } from '../model/parent-lead-model.js';
import { parentLeadStatusModel } from '../model/parent-lead-model.js';
import { getRandomCelebrationGif } from '../config/success-sticker.js';
import {
  sendTelegramMessage,
  sendTelegramSticker,
} from './telegram-bot-service.js';
import { telegramService } from './telegram-service.js';
import { TelegramBaseService } from './telegram-base-service.js';
import { telegramCalenderService } from './telegram-calender-service.js';
import { remainderModel } from '../model/remainder-model.js';

const groupSplitter = '&&';
const keyValueSplitter = ':';

const prefixParentId = (parentId: string, suffix: string): string =>
  `parent_id${keyValueSplitter}${parentId}${groupSplitter}${suffix}`;

const requestedStatusPrefix = 'requested';

const prefixRequestedStatus = (status: LeadStatus): string =>
  `${requestedStatusPrefix}${keyValueSplitter}${status}`;

const suggestNextTwoStatus = (
  parentId: string,
  currentStatus: LeadStatus
): TelegramBot.InlineKeyboardButton[][] => {
  switch (currentStatus) {
    case LeadStatus.LEAD:
      return [
        [
          {
            text: 'Mark: Dictation Requested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.DICTATION_REQUESTED)
            ),
          },
          {
            text: 'Mark: Free Trial Requested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.FREE_TRIAL_REQUESTED)
            ),
          },
        ],
        [
          {
            text: 'Mark: Dictation Done',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.DICTATION)
            ),
          },
          {
            text: 'Mark: Not Interested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.NOT_INTERESTED)
            ),
          },
        ],
      ];
    case LeadStatus.DICTATION_REQUESTED:
      return [
        [
          {
            text: 'Mark: Dictation Done',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.DICTATION)
            ),
          },
          {
            text: 'Mark: Not Interested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.NOT_INTERESTED)
            ),
          },
        ],
      ];
    case LeadStatus.DICTATION:
      return [
        [
          {
            text: 'Mark: Free Trial Requested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.FREE_TRIAL_REQUESTED)
            ),
          },
          {
            text: 'Mark: Not Interested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.NOT_INTERESTED)
            ),
          },
        ],
      ];
    case LeadStatus.FREE_TRIAL_REQUESTED:
      return [
        [
          {
            text: 'Mark: Free Trial',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.FREE_TRIAL)
            ),
          },
          {
            text: 'Mark: Not Interested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.NOT_INTERESTED)
            ),
          },
        ],
      ];
    case LeadStatus.FREE_TRIAL:
      return [
        [
          {
            text: 'Mark: Paid Requested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.PAID_REQUESTED)
            ),
          },
          {
            text: 'Mark: Not Interested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.NOT_INTERESTED)
            ),
          },
        ],
      ];
    case LeadStatus.PAID_REQUESTED:
      return [
        [
          {
            text: 'Mark: Paid',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.PAID)
            ),
          },
          {
            text: 'Mark: Not Interested',
            callback_data: prefixParentId(
              parentId,
              prefixRequestedStatus(LeadStatus.NOT_INTERESTED)
            ),
          },
        ],
      ];
    default:
      return [];
  }
};

class TelegramUpdateLeadService extends TelegramBaseService {
  canHandle(body: TelegramBot.Update): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } {
    if (
      body.callback_query?.data &&
      body.callback_query.data.startsWith('parent_id')
    ) {
      return true;
    }
    if (this.canHandleScheduleLaterButton(body)) {
      return true;
    }
    if (this.canHandleFollowUp1HourButton(body)) {
      return true;
    }
    return false;
  }
  canHandleScheduleLaterButton(
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } {
    const [text, parentId] = body.callback_query?.data?.split(':') || [];
    return text === 'pick_date_time' && !!parentId;
  }

  async handleScheduleLaterButton(
    body: TelegramBot.Update & {
      callback_query: TelegramBot.CallbackQuery;
    }
  ) {
    const [, parentId] = body.callback_query.data?.split(':') || [];
    return telegramCalenderService.handleCalendar(
      body.callback_query.message!.chat.id,
      parentId
    );
  }

  async handle(
    body: TelegramBot.Update & {
      callback_query: TelegramBot.CallbackQuery;
    }
  ) {
    console.log('Handling update lead callback');
    if (
      body.callback_query?.data &&
      body.callback_query.data.startsWith('parent_id')
    ) {
      return await this.handleUpdateLead(body);
    } else if (this.canHandleScheduleLaterButton(body)) {
      return await this.handleScheduleLaterButton(body);
    } else if (this.canHandleFollowUp1HourButton(body)) {
      return await this.handleFollowUp1HourButton(body);
    }
    return Promise.resolve();
  }

  canHandleFollowUp1HourButton(
    body: TelegramBot.Update
  ): body is TelegramBot.Update & {
    callback_query: TelegramBot.CallbackQuery;
  } {
    const data = body.callback_query?.data || '';
    return data.startsWith('quick_scheduler:');
  }

  async handleFollowUp1HourButton(
    body: TelegramBot.Update & {
      callback_query: TelegramBot.CallbackQuery;
    }
  ) {
    const [, parentId] = body.callback_query?.data?.split(':') ?? [];
    ensure(parentId, 'Parent ID is missing in callback data');
    const chatId = body.callback_query.message!.chat.id;
    const parent = await parentModel.getById(parentId);
    ensure(parent, 'Parent not found');
    await remainderModel.createRemainder({
      dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      userId: chatId.toString(),
      message: `Your Remainder to follow up with ${parent.name} \n phone Number: ${parent.phoneNumber}`,
    });
    sendTelegramMessage(
      body.callback_query.message!.chat.id,
      `✅ Remainder set to follow up with ${parent.name} in 1 hour.`
    );
  }

  async triggerFlow(body: TelegramBot.Update, parent: ParentUserResponse) {
    const chatId = telegramService.getUserId(body);
    ensure(chatId, 'Chat ID could not be determined from the message');
    await sendTelegramMessage(chatId, `Parent found: ${parent.name}`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Follow up in 1 hour',
              callback_data: `quick_scheduler:${parent.id}:follow:1_hour:`,
            },
            {
              text: 'Schedule a followup',
              callback_data: `pick_date_time:${parent.id}`,
            },
          ],
          ...suggestNextTwoStatus(parent.id, parent.status),
        ],
      },
    });
  }

  isAuthRequired(): boolean {
    return true;
  }

  handleUpdateLead = async (body: TelegramBot.Update) => {
    const chatId = telegramService.getUserId(body);
    ensure(chatId, 'Chat ID could not be determined from the message');

    const data = body.callback_query!.data!;
    const segments = data.split(groupSplitter);
    const parentIdSegment = segments.find(segment =>
      segment.startsWith('parent_id')
    );
    const requestedStatusSegment = segments.find(segment =>
      segment.startsWith(requestedStatusPrefix)
    );

    ensure(parentIdSegment, 'Parent ID segment not found in callback data');
    ensure(
      requestedStatusSegment,
      'Requested status segment not found in callback data'
    );

    const parentId = parentIdSegment.split(keyValueSplitter)[1];
    const requestedStatus = leadStatusConverter.fromTelegram(
      requestedStatusSegment.split(keyValueSplitter)[1]
    );

    const leadStatus = await parentLeadStatusModel.updateLeadStatus(
      parentId,
      requestedStatus
    );

    if (leadStatus.status === LeadStatus.PAID_REQUESTED) {
      await sendTelegramSticker(chatId, getRandomCelebrationGif());
      await sendTelegramMessage(chatId, '🎉 Payment requested! Great job! 💪');
    } else {
      await sendTelegramMessage(
        chatId,
        `✅ Update Done \n Status Changed: ${leadStatusConverter.toString(leadStatus.status)} \n Parent: ${leadStatus.name}`
      );
    }
  };
}

export const telegramUpdateLeadService = new TelegramUpdateLeadService();
