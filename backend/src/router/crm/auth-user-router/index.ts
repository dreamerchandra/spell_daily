import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';

const crmAuthRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/auth';

crmAuthRouter.post(
  `${baseVersion}${baseRoute}/telegram`,
  telegramWebAppAdminMiddleware,
  (req, res) => {
    const user = req.telegramAdminUser!;
    return res.status(200).json({
      id: user.id,
      telegramId: Number(user.telegramId),
      name: user.name,
      createdAt: user.createdAt,
    });
  }
);

export default [crmAuthRouter] as RouterType[];
