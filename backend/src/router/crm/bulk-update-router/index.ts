import { Router, type Router as RouterType } from 'express';
import { adminJwtAuthMiddleware } from '../../../middleware/bulk-update-middleware.js';
import { bulkUpdateService } from '../../../services/crm/bulk-update-service.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';

const crmBulkUpdateRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/bulk-update';

crmBulkUpdateRouter.post(
  `${baseVersion}${baseRoute}/gsheet-dryrun`,
  adminJwtAuthMiddleware,
  asyncErrorHandler(async (req, res) => {
    const response = await bulkUpdateService.doDryRunUpdate(req.body);

    return res.status(200).json(response);
  })
);

crmBulkUpdateRouter.post(
  `${baseVersion}${baseRoute}/gsheet`,
  adminJwtAuthMiddleware,
  (_req, res) => {
    // const payload = ParentPayloadSchema.parse(req.body);

    return res.status(200).json({});
  }
);

export default [crmBulkUpdateRouter] as RouterType[];
