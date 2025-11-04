import { analyticsModel } from '../model/analytics-model.js';
import { ensure } from '../types/ensure.js';

class AnalyticsService {
  private isValidBody = (
    body: unknown
  ): body is {
    testCode: string;
  } => {
    if (typeof body === 'object' && body !== null) {
      return true;
    }
    return false;
  };
  async markAsStarted(body: unknown) {
    ensure(this.isValidBody(body), 'Invalid CreateTestCodeRequest');
    return analyticsModel.markAsStarted(body.testCode);
  }

  async markAsCompleted(body: unknown) {
    ensure(this.isValidBody(body), 'Invalid CreateTestCodeRequest');
    return analyticsModel.markAsCompleted(body.testCode);
  }
}

export const analyticsService = new AnalyticsService();
