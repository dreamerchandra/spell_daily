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
      parentId: result.parentId || undefined,
    };
  }
}

export const testCodeModel = new TestCodeModel();
