import type { User } from '../type/user';
import { env } from '../config/env';

export interface UsersApiParams {
  parentId: string;
}

export interface UsersApiResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  parentDetails: {
    name?: string;
    id: string;
    createdAt: string;
    details?: string;
    phoneNumber?: string;
  };
}

export type CreateTestCodeResponse = {
  testCode: string;
  parentId?: string;
  createdAt: Date;
  parent?: {
    id: string;
    phoneNumber: string;
    name?: string | null;
    details: string[];
    adminId: string;
    adminName?: string;
  };
};

const BASE_URL = '/crm/v1/test-code';

export const fetchParentUsers = async (
  params: UsersApiParams,
  apiKey: string
): Promise<UsersApiResponse> => {
  try {
    const url = new URL(`${BASE_URL}/${params.parentId}`, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      users: data.data.testCodes,
      total: data.data.testCodes.length,
      page: 1,
      limit: data.data.testCodes.length,
      parentDetails: data.data.parentDetails,
    };
  } catch (error) {
    console.warn('API call failed, using mock data:', error);

    throw error;
  }
};

export const addParentUsers = async (
  params: UsersApiParams & { name: string; grade: number },
  apiKey: string
): Promise<CreateTestCodeResponse> => {
  try {
    const url = new URL(`${BASE_URL}/${params.parentId}`, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ name: params.name, grade: params.grade }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data as CreateTestCodeResponse;
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};
