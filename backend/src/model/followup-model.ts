import z from 'zod';
import { prismaClient } from '../prisma.js';

export const createFollowupSchema = z.object({
  adminId: z.string(),
  parentId: z.string(),
  testCode: z.string().optional(),
  notes: z.string(),
});

export const getFollowupsSchema = z.object({
  parentId: z.string(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  testCode: z.string().optional(),
});

export type CreateFollowupParams = z.infer<typeof createFollowupSchema>;
export type GetFollowupsParams = z.infer<typeof getFollowupsSchema>;

export type Followup = {
  id: string;
  adminId: string;
  parentId: string;
  testCode: string | null;
  notes: string;
  createdAt: Date;
};

export type FollowupWithAdmin = {
  id: string;
  text: string;
  date: Date;
  adminName: string;
};

export type FollowupsResponse = {
  page: {
    total: number;
    currentPage: number;
    limit: number;
  };
  data: FollowupWithAdmin[];
};

class FollowupModel {
  async createFollowup(
    data: CreateFollowupParams & {
      markOnCalendar: boolean;
    }
  ): Promise<Followup> {
    await createFollowupSchema.parseAsync(data);
    const result = await prismaClient.followup.create({
      data: {
        adminId: data.adminId,
        parentId: data.parentId,
        testCode: data.testCode ?? null,
        notes: data.notes,
        markOnCalendar: data.markOnCalendar,
      },
    });

    return result;
  }

  async getFollowups(params: GetFollowupsParams): Promise<FollowupsResponse> {
    const validatedParams = await getFollowupsSchema.parseAsync(params);
    const { parentId, page, limit, testCode } = validatedParams;
    const skip = (page - 1) * limit;

    // Verify parent exists
    const parentExists = await prismaClient.parentUser.findUnique({
      where: { id: parentId },
      select: { id: true },
    });

    if (!parentExists) {
      throw new Error('Parent not found');
    }

    // Get total count for pagination
    const total = await prismaClient.followup.count({
      where: {
        parentId: parentId,
        OR: [
          {
            testCode: testCode,
          },
          {
            testCode: undefined,
          },
        ],
      },
    });

    // Get followups with admin information
    const followups = await prismaClient.followup.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        admin: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Most recent first for pagination
      },
      skip,
      take: limit,
    });

    // Transform the data to match the expected format
    const data: FollowupWithAdmin[] = followups.map(followup => ({
      id: followup.id,
      text: followup.notes,
      date: followup.createdAt,
      adminName:
        followup.admin.name ?? followup.admin.username ?? 'Unknown Admin',
    }));

    return {
      page: {
        total,
        currentPage: page,
        limit,
      },
      data,
    };
  }

  async createFollowupForParent(
    parentId: string,
    adminId: string,
    text: string,
    testCode?: string
  ): Promise<FollowupWithAdmin> {
    // Verify parent exists
    const parentExists = await prismaClient.parentUser.findUnique({
      where: { id: parentId },
      select: { id: true },
    });

    if (!parentExists) {
      throw new Error('Parent not found');
    }

    const result = await prismaClient.followup.create({
      data: {
        adminId,
        parentId,
        notes: text,
        markOnCalendar: true,
        testCode: testCode ?? null,
      },
      include: {
        admin: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    return {
      id: result.id,
      text: result.notes,
      date: result.createdAt,
      adminName: result.admin.name ?? result.admin.username ?? 'Unknown Admin',
    };
  }
}

export const followupModel = new FollowupModel();
