import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, url, headers } = req;

  logger.log('Incoming request', {
    method,
    url,
    userAgent: headers['user-agent'],
    ip: req.ip || req.socket.remoteAddress,
    contentType: headers['content-type'],
  });

  let requestFinished = false;

  const onFinish = () => {
    if (requestFinished) return;
    requestFinished = true;

    const duration = Date.now() - startTime;
    const { statusCode } = res;
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warning' : 'log';

    logger[logLevel]('Request completed', {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length') || 0,
    });

    cleanup();
  };

  const onClose = () => {
    if (requestFinished) return;
    requestFinished = true;

    logger.warning('Request terminated - connection closed', {
      method,
      url,
      duration: `${Date.now() - startTime}ms`,
      reason: 'Client disconnected',
    });

    cleanup();
  };

  const onError = (error: Error) => {
    if (requestFinished) return;
    requestFinished = true;

    logger.error('Request terminated - unhandled exception', error, {
      method,
      url,
      duration: `${Date.now() - startTime}ms`,
      errorName: error.name,
      errorMessage: error.message,
    });

    cleanup();
  };

  const cleanup = () => {
    res.removeListener('finish', onFinish);
    res.removeListener('close', onClose);
    res.removeListener('error', onError);
  };

  res.on('finish', onFinish);
  res.on('close', onClose);
  res.on('error', onError);

  next();
};
