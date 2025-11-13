import { Router, type Router as RouterType } from 'express';
import { adminJwtAuthMiddleware } from '../../middleware/bulk-update-middleware.js';

const crmAnalyticsRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/bulk-update';

crmAnalyticsRouter.get(
  `${baseVersion}${baseRoute}/parent`,
  adminJwtAuthMiddleware,
  (_req, res) => {
    // const testCode = req.params.testCode;
    // const month = Number((req.query as { month?: string }).month);
    // const year = Number((req.query as { year?: string }).year);
    // const result = await analyticsUserService.getUserAnalytics({
    //   testCode,
    //   month,
    //   year,
    // });
    // const testCodeDetails = await testCodeModel.getByTestCode(testCode);
    // ensure(testCodeDetails, 'Test code not found');

    return res.status(200).json({});
  }
);

export default [crmAnalyticsRouter] as RouterType[];
