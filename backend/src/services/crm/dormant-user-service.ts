import { ensure } from '../../types/ensure.js';
import {
  DormantUserApiParams,
  DormantUserResponse,
  dormantUserSchema,
  testCodeModel,
} from '../../model/test-code-model.js';

class DormantUserService {
  isValidDormantUserQuery(query: unknown): query is DormantUserApiParams {
    const params = query as DormantUserApiParams;
    const result = dormantUserSchema.parse(params);
    return Boolean(result);
  }
  async getDormantUsers(
    query: unknown,
    currentAdminId?: string
  ): Promise<{
    freeTrial: DormantUserResponse[];
    paid: DormantUserResponse[];
    dict: DormantUserResponse[];
  }> {
    ensure(this.isValidDormantUserQuery(query), 'Invalid query parameters');
    const dictPromise = testCodeModel.getDormantUsers(
      { ...query, status: 'DICTATION' },
      currentAdminId
    );
    const paidPromise = testCodeModel.getDormantUsers(
      { ...query, status: 'PAID' },
      currentAdminId
    );
    const freeTrialPromise = testCodeModel.getDormantUsers(
      { ...query, status: 'FREE_TRIAL' },
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
