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
    const parenId = req.params.parentId;
    const testCodes = await testCodeModel.getTestCodesByParentId(parenId);
    return res.status(200).json({
      data: testCodes,
    });
  })
);

export default [crmTestCodeRouter] as RouterType[];
