import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { dormantUserService } from '../../../services/crm/dormant-user-service.js';

const crmDormantAuthRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/users';

crmDormantAuthRouter.get(
  `${baseVersion}${baseRoute}/dormant`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const user = req.telegramAdminUser!;
    const dormantUsers = await dormantUserService.getDormantUsers(
      req.query,
      user.id
    );
    return res.status(200).json({
      data: dormantUsers,
    });
  })
);

export default [crmDormantAuthRouter] as RouterType[];
