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
    const { parentId, kidName } = req.params;
    const parent = await parentModel.getById(parentId);
    ensure(parent, 'Parent entity not found');
    const testCode = testCodeModel.generateTestCode(kidName);
    const testCodeResult = await testCodeModel.createTestCode({
      testCode,
      name: kidName,
      parentId: parent.id,
    });
    return res.status(200).json({
      data: testCodeResult,
    });
  })
);

export default [crmTestCodeRouter] as RouterType[];
