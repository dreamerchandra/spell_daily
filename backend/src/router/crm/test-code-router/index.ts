import { Router, type Router as RouterType } from 'express';
import { telegramWebAppAdminMiddleware } from '../../../middleware/admin_middleware.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';
import { testCodeModel } from '../../../model/test-code-model.js';
import { parentModel } from '../../../model/parent-model.js';
import { ensure } from '../../../types/ensure.js';
import z from 'zod';

const crmTestCodeRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/test-code';
const editBaseRoute = '/edit-test-code';

const testCodeModelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  grade: z.number().optional(),
  testCode: z.string().min(1, 'Test code is required'),
});

crmTestCodeRouter.post(
  `${baseVersion}${baseRoute}/:parentId`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { parentId } = req.params;
    const { name, testCode, grade } = testCodeModelSchema.parse(req.body);
    const kidName = name.trim();
    const parent = await parentModel.getById(parentId);
    ensure(parent !== null && parent !== undefined, 'Parent entity not found');
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

crmTestCodeRouter.put(
  `${baseVersion}${editBaseRoute}/:oldTestCode`,
  telegramWebAppAdminMiddleware,
  asyncErrorHandler(async (req, res) => {
    const { oldTestCode } = req.params;
    const { name, testCode, grade } = testCodeModelSchema.parse(req.body);
    const kidName = name.trim();
    const testCodeResult = await testCodeModel.updateTestCode(oldTestCode, {
      testCode,
      name: kidName,
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
