import { env } from './config/env.js';
if (env.isProduction) {
  await import('newrelic');
}
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from './generated/prisma/client.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { requestLoggerMiddleware } from './middleware/requestLogger.js';
import { logger } from './lib/logger.js';
import router from './router/index.js';

const app = express();
const prisma = new PrismaClient();

app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  logger.log('Root endpoint accessed');
  res.json({
    message: 'Hello from backend!',
    requestId: req.requestId,
  });
});
app.use('/api', router);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method,
  });
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    requestId: req.requestId,
  });
});

app.listen(env.PORT, () => {
  logger.log(`Server is running on port ${env.PORT}`);
});

process.on('SIGINT', async () => {
  logger.log('Shutting down server gracefully...');
  await prisma.$disconnect();
  logger.log('Database connection closed');
  process.exit(0);
});
