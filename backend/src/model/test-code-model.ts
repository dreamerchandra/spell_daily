import z from 'zod';
import { prismaClient } from '../prisma.js';

export const testCodeSchema = z.object({
  testCode: z.string(),
  parentId: z.string().optional(),
  name: z.string().optional(),
});

export type CreateTestCodeRequest = z.infer<typeof testCodeSchema>;

export type TestCodeResponse = {
  testCode: string;
  parentId?: string;
  createdAt: Date;
};

export const dormantUserSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['ALL', 'FREE_TRIAL', 'DICTATION', 'PAID']).optional(),
  userAdmin: z.enum(['ALL', 'MY']).optional(),
  lastAccess: z
    .union([z.number(), z.string(), z.literal('ALL')])
    .optional()
    .transform(val => {
      if (val === 'ALL' || val == undefined) return undefined;

      // Convert string to number if it's a numeric string
      let days: number;
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) return undefined;
        days = parsed;
      } else {
        days = val;
      }

      // Convert days to midnight of that many days ago
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - days);
      targetDate.setHours(0, 0, 0, 0); // Set to midnight
      return targetDate;
    }),
});
export type DormantUserApiParams = z.infer<typeof dormantUserSchema>;

type DormantUserResponse = {
  name?: string;
  parentName?: string;
  testCode: string;
  lastCompletedDate: Date;
  phoneNumber?: string;
  status: 'PAID' | 'FREE_TRIAL' | 'DICTATION';
  userAdmin: string;
};

class TestCodeModel {
  generateTestCode(name?: string | null): string {
    const randomAbbreviation = [
      'GIF',
      'SUN',
      'CAT',
      'DOG',
      'BUG',
      'HAT',
      'CAR',
      'BUS',
      'PEN',
      'MAP',
      'BAG',
      'BOX',
    ];
    const randomIndex = Math.floor(Math.random() * randomAbbreviation.length);
    const randomCode = randomAbbreviation[randomIndex];
    const first3Char = name?.substring(0, 3).toUpperCase() || randomCode;
    const randomNumber = Math.floor(100 + Math.random() * 900); // Generates a random 3-digit number
    return `${first3Char}${randomNumber}`.toLocaleLowerCase();
  }
  async createTestCode(
    params: CreateTestCodeRequest
  ): Promise<TestCodeResponse> {
    const result = await prismaClient.students.create({
      data: {
        testCode: params.testCode,
        parentId: params.parentId || null,
        name: params.name,
      },
    });
    return {
      testCode: result.testCode,
      parentId: result.parentId || undefined,
      createdAt: result.createdAt,
    };
  }

  async getByTestCode(testCode: string): Promise<TestCodeResponse | null> {
    const result = await prismaClient.students.findUnique({
      where: {
        testCode,
      },
    });
    if (!result) {
      return null;
    }
    return {
      testCode: result.testCode,
      parentId: result.parentId ?? undefined,
      createdAt: result.createdAt,
    };
  }

  async getDormantUsers(
    query: DormantUserApiParams,
    currentAdminId?: string
  ): Promise<DormantUserResponse[]> {
    // Build the where conditions
    const whereConditions: Record<string, unknown> = {};

    // Filter by search query (student name or parent name)
    if (query.q) {
      whereConditions.OR = [
        {
          name: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          parent: {
            name: {
              contains: query.q,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Filter by student status
    if (query.status && query.status !== 'ALL') {
      whereConditions.status = query.status;
    }

    // Filter by userAdmin (ParentUser.addByAdminId)
    if (query.userAdmin === 'MY' && currentAdminId) {
      whereConditions.parent = {
        ...(whereConditions.parent as Record<string, unknown>),
        addByAdminId: currentAdminId,
      };
    }

    // Add lastAccess filtering to where conditions if specified
    if (query.lastAccess) {
      // Ensure query.lastAccess is a Date object
      let lastAccessDate: Date;
      if (query.lastAccess instanceof Date) {
        lastAccessDate = query.lastAccess;
      } else {
        // Fallback: convert manually if it's not a Date
        const days =
          typeof query.lastAccess === 'string'
            ? parseInt(query.lastAccess, 10)
            : query.lastAccess;

        if (isNaN(days)) return [];

        lastAccessDate = new Date();
        lastAccessDate.setDate(lastAccessDate.getDate() - days);
        lastAccessDate.setHours(0, 0, 0, 0);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      // Students are dormant if they haven't completed activity since the cutoff date
      // Handle both cases: no activity or activity too old
      whereConditions.OR = [
        // Students with no DailyActivity record at all
        {
          DailyActivity: {
            none: {},
          },
        },
        // Students whose last completed activity is older than lastAccessDate
        {
          NOT: {
            DailyActivity: {
              some: {
                status: 'COMPLETED',
                activityDate: {
                  gte: lastAccessDate,
                },
              },
            },
          },
        },
      ];
    }

    const students = await prismaClient.students.findMany({
      where: whereConditions,
      include: {
        parent: {
          include: {
            addByAdmin: true,
          },
        },
        DailyActivity: {
          where: {
            status: 'COMPLETED',
          },
          orderBy: {
            activityDate: 'desc',
          },
          take: 1, // Only get the most recent activity for display
        },
      },
    });

    return students.map(student => {
      const parent = student.parent;
      const lastActivity = student.DailyActivity[0];

      return {
        name: student.name || '',
        parentName: parent?.name || '',
        testCode: student.testCode,
        lastCompletedDate: lastActivity?.activityDate || student.createdAt,
        phoneNumber: parent?.phoneNumber,
        status: student.status,
        userAdmin: parent?.addByAdmin?.name || 'Unknown',
      };
    });
  }

  async getTestCodesByParentId(
    parentId: string
  ): Promise<DormantUserResponse[]> {
    const results = await prismaClient.students.findMany({
      where: {
        parentId,
      },
      include: {
        parent: {
          include: {
            addByAdmin: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return results.map(result => ({
      testCode: result.testCode,
      name: result.name ?? '',
      parentName: result.parent?.name ?? '',
      lastCompletedDate: result.createdAt,
      status: result.status,
      userAdmin: result.parent?.addByAdmin?.name ?? 'Unknown',
    }));
  }
}

export const testCodeModel = new TestCodeModel();
