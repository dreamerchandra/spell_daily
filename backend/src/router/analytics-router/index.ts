import { Router, type Router as RouterType } from 'express';
import { asyncErrorHandler } from '../../middleware/error-middleware.js';
import { analyticsService } from '../../services/analytics-service.js';

const analyticsRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/analytics';

analyticsRouter.post(
  `${baseVersion}${baseRoute}/started`,
  asyncErrorHandler(async (req, res) => {
    const data = await analyticsService.markAsStarted(req.body);
    return res.status(200).json({
      data,
    });
  })
);

analyticsRouter.post(
  `${baseVersion}${baseRoute}/completed`,
  asyncErrorHandler(async (req, res) => {
    const data = await analyticsService.markAsCompleted(req.body);
    return res.status(200).json({
      data,
    });
  })
);

export default [analyticsRouter] as RouterType[];
