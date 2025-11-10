import { env } from './config/env.js';
if (env.isProduction) {
  await import('newrelic');
}
import express, { Request, Response } from 'express';
import { PrismaClient } from './generated/prisma/client.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { requestLoggerMiddleware } from './middleware/requestLogger.js';
import { logger } from './lib/logger.js';
import router from './router/index.js';
import crmRouter from './router/crm/index.js';
import { errorMiddleware } from './middleware/error-middleware.js';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.get('/hello', (req: Request, res: Response) => {
  logger.log('Hello endpoint accessed');
  res.json({
    message: 'Hello from backend!',
    requestId: req.requestId,
  });
});
app.use('/', router);
app.use('/crm', crmRouter);

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  logger.log(`Server is running on port ${env.PORT}`);
});

process.on('SIGINT', async () => {
  logger.log('Shutting down server gracefully...');
  await prisma.$disconnect();
  logger.log('Database connection closed');
  process.exit(0);
});
