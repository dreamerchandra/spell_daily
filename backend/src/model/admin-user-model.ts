import { prismaClient } from '../prisma.js';

class AdminUserModel {
  public async findByTelegramId(telegramId: string | number) {
    const telegramIdStr =
      typeof telegramId === 'number' ? telegramId.toString() : telegramId;
    return await prismaClient.adminUser.findUnique({
      where: { telegramId: telegramIdStr },
    });
  }
  public async createAdminUser(telegramId: string | number) {
    const telegramIdStr =
      typeof telegramId === 'number' ? telegramId.toString() : telegramId;
    return await prismaClient.adminUser.create({
      data: { telegramId: telegramIdStr },
    });
  }
}
export const adminUserModel = new AdminUserModel();
