import type { User } from '../type/user';
import type { FilterOptions } from '../components/FloatingFilter';
import { env } from '../config/env';

export interface UsersApiParams {
  q?: string;
  status?: string;
  userAdmin?: string;
  lastAccess?: number | 'ALL';
}

export interface UsersApiResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export const convertFiltersToParams = (
  filters: FilterOptions,
  searchQuery?: string
): UsersApiParams => {
  const params: UsersApiParams = {};

  if (searchQuery && searchQuery.trim()) {
    params.q = searchQuery.trim();
  }

  if (filters.status !== 'ALL') {
    params.status = filters.status;
  }

  if (filters.userAdmin !== 'ALL') {
    params.userAdmin = filters.userAdmin;
  }

  if (filters.lastAccess !== 'ALL') {
    params.lastAccess = filters.lastAccess;
  }

  return params;
};

const BASE_URL = '/crm/v1/users/dormant';

export const fetchDormantUsers = async (
  params: UsersApiParams,
  apiKey: string
): Promise<UsersApiResponse> => {
  try {
    const url = new URL(BASE_URL, env.BACKEND_URL);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
