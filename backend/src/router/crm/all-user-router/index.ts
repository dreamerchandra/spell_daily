import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { allUsersService } from '../../../services/crm/all-users-service.js';
import { leadOptionModel } from '../../../model/lead-option.js';
import { ensure } from '../../../types/ensure.js';
import { StudentStatus } from '../../../generated/prisma/enums.js';

const allUsersRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/all-users';

// GET /crm/v1/all-users - Fetch all users with filtering and pagination
allUsersRouter.get(
  `${baseVersion}${baseRoute}`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const query = req.query as {
      q?: string;
      phoneNumber?: string;
      leadStatus?: string;
      createdAtBefore?: string;
      createdAtAfter?: string;
      page?: string;
      limit?: string;
      offset?: string;
      orderBy?: string;
      order?: 'asc' | 'desc';
      status?: string;
    };

    const filters = {
      q: query.q,
      phoneNumber: query.phoneNumber,
      leadStatus: query.leadStatus,
      status: query.status as StudentStatus,
      createdAtBefore: query.createdAtBefore,
      createdAtAfter: query.createdAtAfter,
      page: query.page ? parseInt(query.page) : 0,
      limit: query.limit ? parseInt(query.limit) : 10,
      offset: query.offset ? parseInt(query.offset) : 0,
      orderBy: query.orderBy ?? 'createdAt',
      order: query.order ?? 'desc',
    };

    const result = await allUsersService.getAllUsers(filters);

    return res.status(200).json(result);
  })
);

allUsersRouter.get(
  `${baseVersion}/all-test-users`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (_req, res) => {
    const result = await allUsersService.getAllTestCodeMiniVersion();

    return res.status(200).json(result);
  })
);

// PUT /crm/v1/all-users/:testCode/status - Update lead status
allUsersRouter.put(
  `${baseVersion}${baseRoute}/:testCode/status`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { testCode } = req.params;
    const { leadStatus } = req.body as { leadStatus: string };

    await allUsersService.updateLeadStatus(testCode, leadStatus);

    return res.status(200).json({
      message: 'Lead status updated successfully',
    });
  })
);

allUsersRouter.put(
  `${baseVersion}${baseRoute}/:testCode/student-status`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { testCode } = req.params;
    const { status } = req.body as { status: string };
    ensure(
      Object.keys(StudentStatus).includes(status),
      'Invalid student status'
    );
    await allUsersService.updateStudentStatus(
      testCode,
      status as StudentStatus
    );

    return res.status(200).json({
      message: 'Student status updated successfully',
    });
  })
);

// GET /crm/v1/lead-status - Fetch all lead statuses
allUsersRouter.get(
  `${baseVersion}/lead-status`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (_req, res) => {
    const statuses = await leadOptionModel.getAllOptions();

    return res.status(200).json(statuses);
  })
);

export default [allUsersRouter] as RouterType[];
