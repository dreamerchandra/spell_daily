import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { followupModel } from '../../../model/followup-model.js';
import { logger } from '../../../lib/logger.js';

const crmFollowUpRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/follow-ups';

// GET /crm/v1/follow-ups/:parentId - Get follow-ups for a parent with pagination
crmFollowUpRouter.get(
  `${baseVersion}${baseRoute}/:parentId`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { parentId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const testCode = req.query.testCode as string | undefined;

    // Validate query parameters
    if (page < 1) {
      return res.status(400).json({
        error: 'Page must be greater than 0',
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Limit must be between 1 and 100',
      });
    }

    try {
      logger.info('Fetching follow-ups', { parentId, page, limit });
      const result = await followupModel.getFollowups({
        parentId,
        page,
        limit,
        testCode,
      });

      logger.info('Successfully fetched follow-ups', {
        parentId,
        totalCount: result.page.total,
        returnedCount: result.data.length,
      });

      return res.status(200).json(result);
    } catch (error) {
      if ((error as Error).message === 'Parent not found') {
        return res.status(404).json({
          error: 'Parent not found',
        });
      }
      throw error;
    }
  })
);

// POST /crm/v1/follow-ups/:parentId - Create a new follow-up for a parent
crmFollowUpRouter.post(
  `${baseVersion}${baseRoute}/:parentId`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { parentId } = req.params;
    const { text, testCode } = req.body;
    const userId = req.telegramAdminUser!.id;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required and cannot be empty',
      });
    }

    if (text.trim().length > 5000) {
      return res.status(400).json({
        error: 'Text cannot exceed 5000 characters',
      });
    }

    try {
      logger.info('Creating follow-up', {
        parentId,
        adminId: userId,
        textLength: text.trim().length,
      });

      const result = await followupModel.createFollowupForParent(
        parentId,
        userId,
        text.trim(),
        testCode
      );

      logger.info('Successfully created follow-up', {
        parentId,
        followupId: result.id,
      });

      return res.status(201).json({
        data: result,
      });
    } catch (error) {
      if ((error as Error).message === 'Parent not found') {
        return res.status(404).json({
          error: 'Parent not found',
        });
      }
      throw error;
    }
  })
);

// Legacy POST endpoint for backward compatibility
crmFollowUpRouter.post(
  `${baseVersion}/followup`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const userId = req.telegramAdminUser!.id;
    const followup = await followupModel.createFollowup({
      ...req.body,
      adminId: userId,
      markOnCalendar: true,
    });
    return res.status(200).json({
      data: followup,
    });
  })
);

export default [crmFollowUpRouter] as RouterType[];
