import { NextFunction, Response, Request } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../types/http-error.js';
import { NotFoundError } from '../types/not-found-error.js';
import { UniqueConstraintError } from '../types/unique-constrain-error.js';
import { logger } from '../lib/logger.js';

export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error('💥 Error caught:', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: err.issues,
    });
  }

  // Handle known errors (like custom app errors)
  if (err instanceof HttpError) {
    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback for unknown/unexpected errors
  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};

export const asyncErrorHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      errorMiddleware(error, req, res, next);
    }
  };
