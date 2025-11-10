import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { followupModel } from '../../../model/followup-model.js';

const crmFollowUpRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/followup';

crmFollowUpRouter.post(
  `${baseVersion}${baseRoute}`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const userId = req.telegramAdminUser!.id;
    const dormantUsers = await followupModel.createFollowup({
      ...req.body,
      adminId: userId,
    });
    return res.status(200).json({
      data: dormantUsers,
    });
  })
);

export default [crmFollowUpRouter] as RouterType[];
