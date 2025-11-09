import { ensure } from '../../types/ensure.js';
import {
  DormantUserApiParams,
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
  ): Promise<unknown[]> {
    ensure(this.isValidDormantUserQuery(query), 'Invalid query parameters');
    return testCodeModel.getDormantUsers(query, currentAdminId);
  }
}

export const dormantUserService = new DormantUserService();
