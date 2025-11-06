import winston from 'winston';
import { asyncContext } from './asyncContext.js';
import { env } from '../config/env.js';

const requestIdFormat = winston.format(info => {
  const requestId = asyncContext.getRequestId();
  if (requestId) {
    info.requestId = requestId;
  }
  return info;
});

const newrelicFormat = winston.format(info => {
  if (env.isProduction) {
    try {
      void import('newrelic').then(newrelic => {
        const logEvent: Record<string, unknown> = {
          message: String(info.message),
          level: String(info.level),
          timestamp: Date.now(),
        };

        if (info.requestId) {
          logEvent.requestId = info.requestId;
        }

        if (info.metadata && typeof info.metadata === 'object') {
          Object.assign(logEvent, info.metadata);
        }

        newrelic.default.recordLogEvent(logEvent as never);
      });
    } catch {
      // Silently ignore in development
    }
  }
  return info;
});

const formats = [
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  requestIdFormat(),
  winston.format.errors({ stack: true }),
  winston.format.metadata({
    fillExcept: ['message', 'level', 'timestamp', 'requestId'],
  }),
];

if (env.isProduction) {
  formats.push(newrelicFormat());
}

formats.push(winston.format.json());

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        ({ timestamp, level, message, requestId, metadata }) => {
          const reqId = requestId ? `[${requestId}]` : '';
          const meta =
            Object.keys(metadata || {}).length > 0
              ? JSON.stringify(metadata)
              : '';
          return `${timestamp} ${level} ${reqId}: ${message} ${meta}`;
        }
      )
    ),
  }),
];

if (env.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: '/tmp/error.log',
      level: 'error',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: '/tmp/combined.log',
      format: winston.format.json(),
    })
  );
}

const winstonLogger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(...formats),
  transports,
});

class Logger {
  debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, meta);
  }

  log(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, meta);
  }

  warning(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, meta);
  }

  error(
    message: string,
    error?: Error | unknown,
    meta?: Record<string, unknown>
  ): void {
    const errorMeta =
      error instanceof Error
        ? { error: error.message, stack: error.stack }
        : {};
    winstonLogger.error(message, { ...errorMeta, ...(meta || {}) });
  }
}

export const logger = new Logger();
