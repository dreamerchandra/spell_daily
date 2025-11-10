import z from 'zod';
import { prismaClient } from '../prisma.js';

export const createFollowupSchema = z.object({
  adminId: z.string(),
  parentId: z.string(),
  testCode: z.string().optional(),
  notes: z.string(),
});
export type CreateFollowupParams = z.infer<typeof createFollowupSchema>;
export type Followup = {
  id: string;
  adminId: string;
  parentId: string;
  testCode: string | null;
  notes: string;
  createdAt: Date;
};

class FollowupModel {
  async createFollowup(data: CreateFollowupParams): Promise<Followup> {
    await createFollowupSchema.parseAsync(data);
    const result = await prismaClient.followup.create({
      data: {
        adminId: data.adminId,
        parentId: data.parentId,
        testCode: data.testCode ?? null,
        notes: data.notes,
      },
    });

    return result;
  }
}

export const followupModel = new FollowupModel();
