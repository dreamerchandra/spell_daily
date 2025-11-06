import { Router, type Router as RouterType } from 'express';
import { prismaClient } from '../../prisma.js';
import { getNowIST } from '../../utils/date.js';

const healthRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/health';

const checkDatabase = async () => {
  try {
    await prismaClient.$connect();
    return true;
  } catch {
    return false;
  }
};

healthRouter.get(`${baseVersion}${baseRoute}`, async (_req, res) => {
  const isDatabaseConnected = await checkDatabase();
  return res.status(200).json({
    server: true,
    database: isDatabaseConnected,
    timeNow: getNowIST().toISOString(),
  });
});

export default [healthRouter] as RouterType[];
