import { Request, Response, NextFunction } from 'express';
import { asTelegramRequest } from '../router/telegram-router/bot.js';
import { ensure } from '../types/ensure.js';
import { adminUserModel } from '../model/admin-user-model.js';
import { logger } from '../lib/logger.js';
import { telegramService } from '../services/telegram-service.js';

export const telegramAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const botRequest = asTelegramRequest(req);
    ensure(botRequest, 'Request is not a Telegram request');
    const userId = telegramService.getUserId(botRequest);
    ensure(userId, 'Telegram user ID is missing in the request');
    if (!telegramService.isAuthRequired(botRequest)) {
      return next();
    }
    const userModel = await adminUserModel.findByTelegramId(userId);
    if (!userModel) {
      return res
        .status(200)
        .json({ error: 'Forbidden: Admin access required' });
    }
    return next();
  } catch (error) {
    logger.error('Error in telegramAdminMiddleware', error);
    return res.status(200).json({ error: (error as Error).message });
  }
};
