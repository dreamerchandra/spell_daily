import { env } from '../config/env.js';

export const FE_URL = {
  getReportUrl: (): string => {
    const feUrl = env.TELEGRAM_FE_URL;
    return `${feUrl}/`;
  },
  getAllUsersUrl: (): string => {
    const feUrl = env.TELEGRAM_FE_URL;
    return `${feUrl}/all-users`;
  },
  getGenerateTestCodeUrl: (parentId: string): string => {
    const feUrl = env.TELEGRAM_FE_URL;
    return `${feUrl}/parent/${parentId}`;
  },
  getAnalyticsForTestCode: (testCode: string): string => {
    const feUrl = env.TELEGRAM_FE_URL;
    return `${feUrl}/analytics/${testCode}`;
  },
};
