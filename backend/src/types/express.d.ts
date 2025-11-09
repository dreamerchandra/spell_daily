import { AdminUserType } from '../model/admin-user-model';
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      telegramAdminUser?: AdminUserType;
    }
  }
}

export {};
