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
}

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
      users: data.data,
      total: data.data.length,
      page: 1,
      limit: data.data.length,
    };
  } catch (error) {
    console.warn('API call failed, using mock data:', error);

    throw error;
  }
};

export const addParentUsers = async (
  params: UsersApiParams & { name: string },
  apiKey: string
): Promise<void> => {
  try {
    const url = new URL(`${BASE_URL}/${params.parentId}`, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ name: params.name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};
