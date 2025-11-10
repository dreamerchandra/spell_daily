import crmTestCodeRouter from './test-code-router/index.js';
import crmAuthRouter from './auth-user-router/index.js';
import crmDormantAuthRouter from './dormant-router/index.js';
import crmAnalyticsRouter from './analytics-user-router/index.js';
import crmFollowUpRouter from './followup-router/index.js';

export default [
  ...crmTestCodeRouter,
  ...crmAuthRouter,
  ...crmDormantAuthRouter,
  ...crmAnalyticsRouter,
  ...crmFollowUpRouter,
];
