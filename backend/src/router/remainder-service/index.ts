import { Router, type Router as RouterType } from 'express';
import { remainderService } from '../../services/remainder-service.js';
import { asyncErrorHandler } from '../../middleware/error-middleware.js';
import { remainderAuthMiddleware } from '../../middleware/remainder-middleware.js';

const remainderRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/remainder';

remainderRouter.post(
  `${baseVersion}${baseRoute}/create`,
  asyncErrorHandler(async (req, res) => {
    const remainder = await remainderService.scheduleReminders(req.body);
    return res.status(200).json({
      server: true,
      remainder,
    });
  })
);

remainderRouter.post(
  `${baseVersion}${baseRoute}/trigger`,
  remainderAuthMiddleware,
  asyncErrorHandler(async (_req, res) => {
    await remainderService.triggerReminders();
    return res.status(200).json({
      server: true,
    });
  })
);

export default [remainderRouter] as RouterType[];
