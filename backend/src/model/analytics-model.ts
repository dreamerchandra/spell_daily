import { prismaClient } from '../prisma.js';
import { ensure } from '../types/ensure.js';
import { testCodeModel } from './test-code-model.js';

class AnalyticsModel {
  async markAsStarted(testCode: string): Promise<void> {
    const code = await testCodeModel.getByTestCode(testCode);
    ensure(code, 'Test code not found');
    await prismaClient.dailyActivity.upsert({
      where: {
        studentTestCode: code.testCode,
        activityDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      create: {
        studentTestCode: code.testCode,
        activityDate: new Date(),
        status: 'STARTED',
      },
      update: {},
    });
  }
  async markAsCompleted(testCode: string): Promise<void> {
    const code = await testCodeModel.getByTestCode(testCode);
    ensure(code, 'Test code not found');
    await prismaClient.dailyActivity.update({
      where: {
        studentTestCode: code.testCode,
        activityDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      data: {
        status: 'COMPLETED',
      },
    });
  }
}

export const analyticsModel = new AnalyticsModel();
