import { env } from '../config/env.js';
import { prismaClient } from '../prisma.js';
import jwt from 'jsonwebtoken';
import { ensure } from '../types/ensure.js';

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
  public async createJWTToken(telegramId: number): Promise<string> {
    const user = await this.findByTelegramId(telegramId);
    ensure(user, 'Admin user not found for JWT token creation');
    const payload = {
      id: user.id,
      telegramId: user.telegramId,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '5m', // Token valid for 5 minutes
    });

    return token;
  }

  public async verifyJWTToken(token: string): Promise<AdminUserType> {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      telegramId: string;
    };
    const telegramId = decoded.telegramId;
    const user = await this.findByTelegramId(telegramId);
    ensure(user, 'Admin user not found for given JWT token');
    return user;
  }
}
export const adminUserModel = new AdminUserModel();
