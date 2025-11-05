import { prismaClient } from '../prisma.js';

export class OtpUserModel {
  public async createOtp(code: string) {
    return await prismaClient.otp.create({
      data: { code },
    });
  }

  public async findByCode(code: string) {
    return await prismaClient.otp.findUnique({
      where: { code },
    });
  }

  public async deleteByCode(code: string) {
    return await prismaClient.otp.delete({
      where: { code },
    });
  }
}

export const otpUserModel = new OtpUserModel();
