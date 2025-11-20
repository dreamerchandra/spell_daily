import z from 'zod';
import { prismaClient } from '../prisma.js';

export const testCodeSchema = z.object({
  testCode: z.string(),
  parentId: z.string().optional(),
  name: z.string().optional(),
  grade: z.number().int().min(1).max(12).optional(),
});

export type CreateTestCodeRequest = z.infer<typeof testCodeSchema>;

export type TestCodeResponse = {
  testCode: string;
  parentId?: string;
  createdAt: Date;
  status: 'PAID' | 'FREE_TRIAL' | 'DICTATION';
  parent?: {
    id: string;
    phoneNumber: string;
    name?: string | null;
    details: string[];
    adminId: string;
    adminName?: string;
  };
  student: {
    id: string;
    name?: string | null;
    grade?: number | null;
  };
};

export const dormantUserSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['ALL', 'FREE_TRIAL', 'DICTATION', 'PAID']).optional(),
  userAdmin: z.enum(['ALL', 'MY']).optional(),
  notCompletedDate: z.preprocess(val => {
    if (val == undefined) return undefined;
    if (val instanceof Date) return val;
    const toMidnight = (date: Date) => {
      date.setHours(0, 0, 0, 0);
      return date;
    };
    if (typeof val === 'string') {
      const parsed = Date.parse(val);
      if (isNaN(parsed)) return undefined;
      return toMidnight(new Date(parsed));
    }
    if (typeof val === 'number') {
      if (val <= 0) {
        return undefined;
      }
      const targetDate = new Date(val);
      return toMidnight(targetDate);
    }

    // Convert days to midnight of that many days ago
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate());
    return toMidnight(targetDate);
  }, z.date().optional()),
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

export type DormantUserResponse = {
  name?: string;
  parentName?: string;
  testCode: string;
  lastCompletedDate: Date | null;
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
        parentId: params.parentId ?? null,
        name: params.name,
        details: params.grade ? { grade: params.grade } : undefined,
      },
      include: {
        parent: {
          include: {
            addByAdmin: true,
          },
        },
      },
    });
    const parent = result.parent ?? null;
    return {
      testCode: result.testCode,
      parentId: result.parentId ?? undefined,
      createdAt: result.createdAt,
      status: result.status,
      student: {
        id: result.testCode,
        name: result.name,
        grade: (result.details as any)?.grade ?? null,
      },
      parent: parent
        ? {
            details: parent.details ?? [],
            adminId: parent.addByAdminId,
            id: parent.id,
            phoneNumber: parent.phoneNumber,
            name: parent.name,
            adminName: parent.addByAdmin?.name ?? undefined,
          }
        : undefined,
    };
  }

  async updateTestCode(
    oldTestCode: string,
    params: CreateTestCodeRequest
  ): Promise<TestCodeResponse> {
    const result = await prismaClient.students.update({
      where: {
        testCode: oldTestCode,
      },
      data: {
        testCode: params.testCode,
        name: params.name,
        details: params.grade ? { grade: params.grade } : undefined,
      },
      include: {
        parent: {
          include: {
            addByAdmin: true,
          },
        },
      },
    });
    const parent = result.parent ?? null;
    return {
      testCode: result.testCode,
      parentId: result.parentId ?? undefined,
      createdAt: result.createdAt,
      status: result.status,
      student: {
        id: result.testCode,
        name: result.name,
        grade: (result.details as any)?.grade ?? null,
      },
      parent: parent
        ? {
            details: parent.details ?? [],
            adminId: parent.addByAdminId,
            id: parent.id,
            phoneNumber: parent.phoneNumber,
            name: parent.name,
            adminName: parent.addByAdmin?.name ?? undefined,
          }
        : undefined,
    };
  }

  async deleteTestCode(oldTestCode: string): Promise<void> {
    await prismaClient.students.delete({
      where: {
        testCode: oldTestCode,
      },
    });
  }

  async getByTestCode(testCode: string): Promise<TestCodeResponse | null> {
    const result = await prismaClient.students.findUnique({
      where: {
        testCode,
      },
      include: {
        parent: {
          include: {
            addByAdmin: true,
          },
        },
      },
    });
    if (!result) {
      return null;
    }
    const parent = result.parent ?? null;
    return {
      testCode: result.testCode,
      parentId: result.parentId ?? undefined,
      createdAt: result.createdAt,
      status: result.status,
      student: {
        id: result.testCode,
        name: result.name,
        grade: (result.details as any)?.grade ?? null,
      },
      parent: parent
        ? {
            details: parent.details ?? [],
            adminId: parent.addByAdminId,
            id: parent.id,
            phoneNumber: parent.phoneNumber,
            name: parent.name,
            adminName: parent.addByAdmin?.name ?? undefined,
          }
        : undefined,
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

    if (query.notCompletedDate) {
      const nextDay = new Date(query.notCompletedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      whereConditions.NOT = {
        DailyActivity: {
          some: {
            status: 'COMPLETED',
            activityDate: {
              gte: query.notCompletedDate,
              lt: nextDay,
            },
          },
        },
      };
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
        lastCompletedDate: lastActivity?.activityDate || null,
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
      lastCompletedDate: null,
      status: result.status,
      userAdmin: result.parent?.addByAdmin?.name ?? 'Unknown',
    }));
  }

  async updateStatus(
    testCode: string,
    status: 'PAID' | 'FREE_TRIAL' | 'DICTATION'
  ): Promise<void> {
    await prismaClient.students.update({
      where: {
        testCode,
      },
      data: {
        status,
      },
    });
  }

  async getUserByStatus(
    status: 'PAID' | 'FREE_TRIAL' | 'DICTATION'
  ): Promise<DormantUserResponse[]> {
    const results = await prismaClient.students.findMany({
      where: {
        status,
      },
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
    return results.map(result => {
      const parent = result.parent;
      const lastActivity = result.DailyActivity[0];
      return {
        name: result.name || '',
        parentName: parent?.name || '',
        testCode: result.testCode,
        lastCompletedDate: lastActivity?.activityDate || null,
        phoneNumber: parent?.phoneNumber,
        status: result.status,
        userAdmin: parent?.addByAdmin?.name || 'Unknown',
      };
    });
  }

  async bulkDeleteTestCodes(testCodes: string[]): Promise<void> {
    await prismaClient.students.deleteMany({
      where: {
        testCode: {
          in: testCodes,
        },
      },
    });
  }
}

export const testCodeModel = new TestCodeModel();
