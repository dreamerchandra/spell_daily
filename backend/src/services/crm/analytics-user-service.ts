import { analyticsModel, DailyUsage } from '../../model/analytics-model.js';
import { analyticsSchema } from '../../model/analytics-model.js';

class AnalyticsUserService {
  async getUserAnalytics(param: unknown): Promise<DailyUsage> {
    const validatedParam = analyticsSchema.parse(param);
    return analyticsModel.getAnalyticsData(validatedParam);
  }
}
export const analyticsUserService = new AnalyticsUserService();
