import z from 'zod';
import { prismaClient } from '../prisma.js';
import { ensure } from '../types/ensure.js';
import { testCodeModel } from './test-code-model.js';

export type DailyUsage = {
  startedAt: Date;
  partialCompletion: Date[];
  notStarted: Date[];
  followUpDates: Date[];
};

export const analyticsSchema = z.object({
  testCode: z.string(),
  month: z.number().min(0).max(11),
  year: z.number().min(2000),
});

export type AnalyticsParams = z.infer<typeof analyticsSchema>;

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

  async getAnalyticsData(params: AnalyticsParams): Promise<DailyUsage> {
    const { month, year } = params;

    // Fetch daily activity data for the specified month and year
    const dailyActivities = await prismaClient.dailyActivity.findMany({
      where: {
        studentTestCode: params.testCode,
        activityDate: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
      include: {
        student: true,
      },
    });
    const student = await testCodeModel.getByTestCode(params.testCode);
    ensure(student, 'Student not found for the given test code');

    // Generate all dates in the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    const allDatesInMonth: Date[] = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      allDatesInMonth.push(new Date(d));
    }

    // Create a set of dates that have activity records for faster lookup
    const activityDatesSet = new Set(
      dailyActivities.map(
        activity => activity.activityDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
      )
    );

    // Process the daily activities to generate the analytics data
    const analyticsData: DailyUsage = {
      startedAt: student.createdAt,
      partialCompletion: [],
      notStarted: [],
      followUpDates: [],
    };

    // Populate partialCompletion with STARTED activities
    dailyActivities.forEach(activity => {
      if (activity.status === 'STARTED') {
        analyticsData.partialCompletion.push(activity.activityDate);
      }
    });

    allDatesInMonth.forEach(date => {
      const dateString = date.toISOString().split('T')[0];
      if (!activityDatesSet.has(dateString)) {
        analyticsData.notStarted.push(date);
      }
    });

    return analyticsData;
  }
}

export const analyticsModel = new AnalyticsModel();
