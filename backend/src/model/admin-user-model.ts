import { prismaClient } from '../prisma.js';

export type AdminUserType = {
  id: string;
  telegramId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
};

class AdminUserModel {
  public async findByTelegramId(
    telegramId: string | number
  ): Promise<AdminUserType | null> {
    const telegramIdStr =
      typeof telegramId === 'number' ? telegramId.toString() : telegramId;
    return await prismaClient.adminUser.findUnique({
      where: { telegramId: telegramIdStr },
    });
  }
  public async createAdminUser(
    telegramId: string | number
  ): Promise<AdminUserType> {
    const telegramIdStr =
      typeof telegramId === 'number' ? telegramId.toString() : telegramId;
    return await prismaClient.adminUser.create({
      data: { telegramId: telegramIdStr },
    });
  }
}
export const adminUserModel = new AdminUserModel();
