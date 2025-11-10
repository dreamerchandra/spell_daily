import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { testCodeModel } from '../../../model/test-code-model.js';
import { parentModel } from '../../../model/parent-model.js';
import { ensure } from '../../../types/ensure.js';

const crmTestCodeRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/test-code';

crmTestCodeRouter.post(
  `${baseVersion}${baseRoute}/:parentId`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { parentId } = req.params;
    const name = (req.body as { name?: string }).name;
    const _grade = Number((req.body as { grade?: string }).grade);
    const grade = isNaN(_grade) ? undefined : _grade;
    ensure(
      typeof name === 'string' && name.length > 0,
      'Name is required in request body'
    );
    const kidName = name.trim();
    const parent = await parentModel.getById(parentId);
    ensure(parent !== null && parent !== undefined, 'Parent entity not found');
    const testCode = testCodeModel.generateTestCode(kidName);
    const testCodeResult = await testCodeModel.createTestCode({
      testCode,
      name: kidName,
      parentId: parent.id,
      grade,
    });
    res.status(200).json({
      data: testCodeResult,
    });
  })
);

crmTestCodeRouter.get(
  `${baseVersion}${baseRoute}/:parentId`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const parentId = req.params.parentId;
    const parentDetails = await parentModel.getById(parentId);
    const testCodes = await testCodeModel.getTestCodesByParentId(parentId);
    return res.status(200).json({
      data: { testCodes, parentDetails },
    });
  })
);

export default [crmTestCodeRouter] as RouterType[];
