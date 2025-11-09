import type { User } from '../type/user';
import type { FilterOptions } from '../components/FloatingFilter';
import { env } from '../config/env';

export interface UsersApiParams {
  q?: string;
  status?: string;
  userAdmin?: string;
  lastAccess?: string;
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
    params.lastAccess = (filters.lastAccess as Date)
      .toISOString()
      .split('T')[0];
  }

  return params;
};

const BASE_URL = '/crm/v1/users/dormant';

const mockUsers: User[] = [
  {
    name: 'Arjun',
    parentName: 'Ramesh Kumar',
    testCode: 'SPL001',
    lastCompletedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    phoneNumber: '+91 9876543210',
    status: 'FREE_TRIAL',
    userAdmin: 'Admin_kumar',
  },
  {
    name: 'Priya',
    parentName: 'Sunita Sharma',
    testCode: 'SPL002',
    lastCompletedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    phoneNumber: '+91 8765432109',
    status: 'PAID',
    userAdmin: 'Admin_sharma',
  },
  {
    name: 'Rohit',
    parentName: 'Vikash Singh',
    testCode: 'SPL003',
    lastCompletedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    phoneNumber: '+91 7654321098',
    status: 'DICTATION',
    userAdmin: 'Admin_singh',
  },
  {
    name: 'Ananya',
    parentName: 'Meera Patel',
    testCode: 'SPL004',
    lastCompletedDate: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    phoneNumber: '+91 6543210987',
    status: 'FREE_TRIAL',
    userAdmin: 'Admin_patel',
  },
];

export const fetchUsers = async (
  params: UsersApiParams
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
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('API call failed, using mock data:', error);

    let filteredUsers = [...mockUsers];

    if (params.q) {
      const query = params.q.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.parentName.toLowerCase().includes(query) ||
          user.testCode.toLowerCase().includes(query) ||
          user.phoneNumber.includes(params.q!)
      );
    }

    if (params.status && params.status !== 'ALL') {
      filteredUsers = filteredUsers.filter(
        user => user.status === params.status
      );
    }

    return {
      users: filteredUsers,
      total: filteredUsers.length,
      page: 1,
      limit: 20,
    };
  }
};
