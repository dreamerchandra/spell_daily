import { logger } from '../lib/logger.js';
import {
  createRemainderSchema,
  CreateRemainderType,
  remainderModel,
  RemainderType,
} from '../model/remainder-model.js';
import { sleep } from '../utils/sleep.js';
import { bot } from './telegram-bot-service.js';

const BATCH_PROCESSING_DELAY_MS = 2000;

type RemainderByUser = Map<string, { remainder: RemainderType[]; message: string[] }>;

class RemainderService {
  isValidScheduleRequest(body: unknown): body is CreateRemainderType {
    createRemainderSchema.parse(body);
    return true;
  }
  async scheduleReminders(body: CreateRemainderType) {
    this.isValidScheduleRequest(body);
    return remainderModel.createRemainder(body);
  }

  async triggerReminders() {
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    const reminders = await remainderModel.getRemainders(fiveMinutesFromNow);
    const batchedRemainders = this.batchRemaindersByUser(reminders);
    await this.processRemainderBatches(batchedRemainders);
  }

  private batchRemaindersByUser(remainders: RemainderType[]): RemainderByUser {
    const batchedRemainders: RemainderByUser = new Map();
    for (const remainder of remainders) {
      if (!batchedRemainders.has(remainder.userId)) {
        batchedRemainders.set(remainder.userId, {
          remainder: [remainder],
          message: [remainder.message],
        });
      } else {
        const userRemainders = batchedRemainders.get(remainder.userId)!;
        batchedRemainders.set(remainder.userId, {
          remainder: [...userRemainders.remainder, remainder],
          message: [...userRemainders.message, remainder.message],
        });
      }
    }
    return batchedRemainders;
  }

  private async sendMessage(
    userId: string,
    messages: string[],
    remainderIds: string[]
  ): Promise<void> {
    try {
      await remainderModel.updateAttemptCount(remainderIds);
    } catch (err) {
      logger.error(`Failed to update attempt count for user ${userId}:`, err);
      return; // Skip sending if DB state isn't updated
    }

    let sent = false;
    try {
      await bot.sendMessage(
        Number(userId),
        `You have the following reminders:\n\n${messages.join('\n')}`
      );
      sent = true;
    } catch (err) {
      logger.error(`Failed to send Telegram message to user ${userId}:`, err);
    }

    if (sent) {
      try {
        await remainderModel.markAsAttended(remainderIds);
      } catch (err) {
        logger.error(`Failed to mark reminders as attended for ${userId}:`, err);
      }
    }
  }

  private async processRemainderBatches(batchedRemainders: RemainderByUser): Promise<void> {
    const userBatches = this.get20UserBatch(batchedRemainders);
    for (const batch of userBatches) {
      await Promise.allSettled(
        batch.map(async (userId) => {
          const userRemainders = batchedRemainders.get(userId);
          if (!userRemainders) return;

          const ids = userRemainders.remainder.map((r) => r.id);
          const messages = userRemainders.message;
          await this.sendMessage(userId, messages, ids);
        })
      );

      await sleep(BATCH_PROCESSING_DELAY_MS);
    }
  }

  private get20UserBatch(batchedRemainders: RemainderByUser): string[][] {
    const userBatches: string[][] = [];

    const userIds = [...batchedRemainders.keys()];
    for (let i = 0; i < userIds.length; i += 20) {
      const batch = userIds.slice(i, i + 20);
      userBatches.push(batch);
    }
    return userBatches;
  }
}

export const remainderService = new RemainderService();
