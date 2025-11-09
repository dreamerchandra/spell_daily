import { Request, Response, NextFunction } from 'express';
import { asTelegramRequest } from '../router/telegram-router/bot.js';
import { ensure } from '../types/ensure.js';
import { adminUserModel } from '../model/admin-user-model.js';
import { logger } from '../lib/logger.js';
import { telegramService } from '../services/telegram-service.js';
import crypto from 'crypto';
import { env } from '../config/env.js';

interface TelegramInitData {
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
  };
  chat_instance?: string;
  chat_type?: string;
  auth_date?: number;
  hash: string;
}

export const telegramChatAdminMiddleware = async (
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

function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}

function parseTelegramInitData(initData: string): TelegramInitData {
  const urlParams = new URLSearchParams(initData);
  const result: Partial<TelegramInitData> = {};

  for (const [key, value] of urlParams.entries()) {
    if (key === 'user') {
      result[key] = JSON.parse(decodeURIComponent(value));
    } else if (key === 'auth_date') {
      result[key] = parseInt(value, 10);
    } else if (key === 'id' || key === 'is_premium') {
      (result.user as any)[key] = parseInt(value, 10);
    } else {
      (result as any)[key] = decodeURIComponent(value);
    }
  }

  return result as TelegramInitData;
}

export const telegramWebAppAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization'];
    ensure(typeof token === 'string', 'Authorization token is missing');
    const [, accessToken] = token.split(' ');
    ensure(accessToken, 'Access token is missing in Authorization header');
    const telegramToken = env.TELEGRAM_BOT_TOKEN;
    const isValid = verifyTelegramWebAppData(accessToken, telegramToken);
    ensure(isValid, 'Invalid Telegram Web App init data');
    const telegramWebAppData = parseTelegramInitData(accessToken);
    ensure(telegramWebAppData, 'Telegram Web App data is missing');
    const userId = telegramWebAppData.user?.id;
    ensure(userId, 'Telegram user ID is missing in Web App data');
    const userModel = await adminUserModel.findByTelegramId(userId);
    ensure(userModel, 'Forbidden: Admin access required');
    req.telegramAdminUser = userModel;
    return next();
  } catch (error) {
    logger.error('Error in telegramWebAppAdminMiddleware', error);
    return res.status(401).json({ error: (error as Error).message });
  }
};
