import crmTestCodeRouter from './test-code-router/index.js';
import crmAuthRouter from './auth-user-router/index.js';
import crmDormantAuthRouter from './dormant-router/index.js';
import crmAnalyticsRouter from './analytics-user-router/index.js';
import crmFollowUpRouter from './followup-router/index.js';
import allUsersRouter from './all-user-router/index.js';
import dataCollectionRouter from './data-collection-router/index.js';
import crmBulkUpdateRouter from './bulk-update-router/index.js';

export default [
  ...crmTestCodeRouter,
  ...crmAuthRouter,
  ...crmDormantAuthRouter,
  ...crmAnalyticsRouter,
  ...crmFollowUpRouter,
  ...allUsersRouter,
  ...dataCollectionRouter,
  ...crmBulkUpdateRouter,
];
