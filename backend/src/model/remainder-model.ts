import z from 'zod';
import { adminUserModel } from './admin-user-model.js';
import { ensure } from '../types/ensure.js';
import { prismaClient } from '../prisma.js';

export const createRemainderSchema = z.object({
  userId: z
    .string()
    .refine(id => Number.isInteger(Number(id)) && Number(id) > 0, {
      message: 'Invalid userId',
    }),
  message: z.string().min(5).max(500),
  dateTime: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

export type CreateRemainderType = z.infer<typeof createRemainderSchema>;

export type RemainderType = {
  id: string;
  userId: string;
  message: string;
  dateTime: Date;
};

class RemainderModel {
  async createRemainder(data: CreateRemainderType): Promise<RemainderType> {
    const user = await adminUserModel.findByTelegramId(data.userId);
    ensure(user, 'User not found');
    return await prismaClient.remainder.create({
      data: {
        userId: user.id,
        message: data.message,
        dateTime: new Date(data.dateTime),
      },
    });
  }

  async getRemainders(tillDate: Date): Promise<RemainderType[]> {
    const remainders = await prismaClient.remainder.findMany({
      where: {
        dateTime: {
          lte: tillDate,
        },
        isActive: true,
        isAttended: false,
        attemptCount: {
          lte: prismaClient.remainder.fields.maxAttempts,
        },
      },
    });
    const user = await prismaClient.adminUser.findMany({
      where: {
        id: {
          in: remainders.map(r => r.userId),
        },
      },
    });
    return remainders.map(remainder => {
      const remainderUser = user.find(u => u.id === remainder.userId);
      ensure(remainderUser, 'Remainder user not found');
      return {
        id: remainder.id,
        userId: remainderUser.telegramId,
        message: remainder.message,
        dateTime: remainder.dateTime,
      };
    });
  }

  async updateAttemptCount(remainderIds: string[]): Promise<void> {
    await prismaClient.remainder.updateMany({
      where: {
        id: {
          in: remainderIds,
        },
      },
      data: {
        attemptCount: {
          increment: 1,
        },
        lastAttemptAt: new Date(),
      },
    });
  }
  async markAsAttended(remainderIds: string[]): Promise<void> {
    await prismaClient.remainder.updateMany({
      where: {
        id: {
          in: remainderIds,
        },
      },
      data: {
        isAttended: true,
      },
    });
  }
}

export const remainderModel = new RemainderModel();
