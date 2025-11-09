import crmTestCodeRouter from './test-code-router/index.js';
import crmAuthRouter from './auth-user-router/index.js';
import crmDormantAuthRouter from './dormant-router/index.js';

export default [
  ...crmTestCodeRouter,
  ...crmAuthRouter,
  ...crmDormantAuthRouter,
];
