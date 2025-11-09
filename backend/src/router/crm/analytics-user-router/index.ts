import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { analyticsUserService } from '../../../services/crm/analytics-user-service.js';

const crmAnalyticsRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/analytics';

crmAnalyticsRouter.get(
  `${baseVersion}${baseRoute}/:testCode`,
  telegramWebAppAdminMiddleware,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const testCode = req.params.testCode;
    const month = Number((req.query as { month?: string }).month);
    const year = Number((req.query as { year?: string }).year);
    const result = await analyticsUserService.getUserAnalytics({
      testCode,
      month,
      year,
    });

    return res.status(200).json({
      data: result,
    });
  })
);

export default [crmAnalyticsRouter] as RouterType[];
