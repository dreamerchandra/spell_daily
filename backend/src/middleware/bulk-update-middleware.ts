import { Request, Response, NextFunction } from 'express';
import { ensure } from '../types/ensure.js';
import { adminUserModel } from '../model/admin-user-model.js';
import { logger } from '../lib/logger.js';
import { asyncContext } from '../lib/asyncContext.js';

export const adminJwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization'];
    ensure(typeof token === 'string', 'Authorization token is missing');
    const [, accessToken] = token.split(' ');
    ensure(accessToken, 'Access token is missing in Authorization header');
    const user = await adminUserModel.verifyJWTToken(accessToken);
    return asyncContext.run(
      { telegramAdminUser: user, requestId: req.requestId },
      () => {
        return next();
      }
    );
  } catch (error) {
    logger.error('Error in telegramWebAppAdminMiddleware', error);
    return res.status(401).json({ error: (error as Error).message });
  }
};
