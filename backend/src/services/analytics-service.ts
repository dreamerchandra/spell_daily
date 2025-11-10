import { analyticsModel } from '../model/analytics-model.js';
import { ensure } from '../types/ensure.js';
import { testCodeModel } from '../model/test-code-model.js';

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
    if (body.testCode.includes('tes')) {
      return;
    }
    return analyticsModel.markAsStarted(body.testCode);
  }

  async markAsCompleted(body: unknown) {
    ensure(this.isValidBody(body), 'Invalid CreateTestCodeRequest');
    if (body.testCode.includes('tes')) {
      return;
    }
    await analyticsModel.markAsCompleted(body.testCode);
    const testCode = await testCodeModel.getByTestCode(body.testCode);
    switch (testCode?.status) {
      case 'DICTATION':
        return await testCodeModel.updateStatus(
          testCode.testCode,
          'FREE_TRIAL'
        );
      default:
        return { message: 'Test code status unknown. No action taken.' };
    }
  }
}

export const analyticsService = new AnalyticsService();
