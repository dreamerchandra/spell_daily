import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';

const crmTestCodeRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/test-code';

crmTestCodeRouter.post(
  `${baseVersion}${baseRoute}/:parentId`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { parentId } = req.params;
  })
);

export default [crmTestCodeRouter] as RouterType[];
