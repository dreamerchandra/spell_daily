import { ensure } from '../../types/ensure.js';
import {
  DormantUserApiParams,
  DormantUserResponse,
  dormantUserSchema,
  testCodeModel,
} from '../../model/test-code-model.js';

class DormantUserService {
  isValidDormantUserQuery(query: unknown): DormantUserApiParams {
    const params = query as DormantUserApiParams;
    const result = dormantUserSchema.parse(params);
    return result;
  }
  async getDormantUsers(
    query: unknown,
    currentAdminId?: string
  ): Promise<{
    freeTrial: DormantUserResponse[];
    paid: DormantUserResponse[];
    dict: DormantUserResponse[];
  }> {
    const processedQuery = this.isValidDormantUserQuery(query);
    ensure(processedQuery, 'Invalid query parameters');
    const dictPromise = testCodeModel.getDormantUsers(
      { ...processedQuery, status: 'DICTATION' },
      currentAdminId
    );
    const paidPromise = testCodeModel.getDormantUsers(
      { ...processedQuery, status: 'PAID' },
      currentAdminId
    );
    const freeTrialPromise = testCodeModel.getDormantUsers(
      { ...processedQuery, status: 'FREE_TRIAL' },
      currentAdminId
    );
    const [dict, paid, freeTrial] = await Promise.all([
      dictPromise,
      paidPromise,
      freeTrialPromise,
    ]);
    return {
      dict,
      paid,
      freeTrial,
    };
  }
}

export const dormantUserService = new DormantUserService();
