import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';
import { env } from '../config/env.js';

export const remainderAuthMiddleware = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (env.isDevelopment) {
      return next();
    }
    const header = _req.headers['x-remainder-auth'];
    if (!header || header !== env.REMAINDER_TOKEN_SECRET) {
      logger.warn('Unauthorized access attempt to remainder endpoint', {
        ip: _req.ip,
      });
      return res.status(403).json({ error: 'Forbidden: Invalid remainder auth token' });
    }
    return next();
  } catch (error) {
    logger.error('Error in remainderAuthMiddleware', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
