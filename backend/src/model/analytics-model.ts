import { prismaClient } from '../prisma.js';
import { ensure } from '../types/ensure.js';
import { testCodeModel } from './test-code-model.js';

class AnalyticsModel {
  async markAsStarted(testCode: string): Promise<void> {
    const code = await testCodeModel.getByTestCode(testCode);
    ensure(code, 'Test code not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Find existing activity for today
    const existingActivity = await prismaClient.dailyActivity.findFirst({
      where: {
        studentTestCode: code.testCode,
        activityDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
    });

    if (existingActivity) {
      // Update existing activity if it's not already completed
      if (existingActivity.status !== 'COMPLETED') {
        await prismaClient.dailyActivity.update({
          where: {
            id: existingActivity.id,
          },
          data: {
            status: 'STARTED',
          },
        });
      }
    } else {
      // Create new activity for today
      await prismaClient.dailyActivity.create({
        data: {
          studentTestCode: code.testCode,
          activityDate: new Date(),
          status: 'STARTED',
        },
      });
    }
  }

  async markAsCompleted(testCode: string): Promise<void> {
    const code = await testCodeModel.getByTestCode(testCode);
    ensure(code, 'Test code not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Find existing activity for today
    const existingActivity = await prismaClient.dailyActivity.findFirst({
      where: {
        studentTestCode: code.testCode,
        activityDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
    });

    if (existingActivity) {
      // Update existing activity to completed
      await prismaClient.dailyActivity.update({
        where: {
          id: existingActivity.id,
        },
        data: {
          status: 'COMPLETED',
        },
      });
    } else {
      // Create new activity directly as completed
      await prismaClient.dailyActivity.create({
        data: {
          studentTestCode: code.testCode,
          activityDate: new Date(),
          status: 'COMPLETED',
        },
      });
    }
  }
}

export const analyticsModel = new AnalyticsModel();
