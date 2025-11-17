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

export type AddParentForm = {
  name: string;
  grade: number | null;
  testCode: string;
};

export const addParentUsers = async (
  params: UsersApiParams & AddParentForm,
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
      body: JSON.stringify({
        name: params.name,
        grade: params.grade,
        testCode: params.testCode,
      }),
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

const EDIT_URL = '/crm/v1/edit-test-code';
export const editTestCode = async (
  params: { oldTestCode: string } & AddParentForm,
  apiKey: string
): Promise<CreateTestCodeResponse> => {
  try {
    const url = new URL(`${EDIT_URL}/${params.oldTestCode}`, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: params.name,
        grade: params.grade,
        testCode: params.testCode,
      }),
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

const DELETE_URL = '/crm/v1/delete-test-code';

export const deleteTestCode = async (
  params: { oldTestCode: string },
  apiKey: string
): Promise<void> => {
  try {
    const url = new URL(`${DELETE_URL}/${params.oldTestCode}`, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return;
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};

const BULK_DELETE_URL = '/crm/v1/bulk-delete-test-code';

export const deleteBulkTestCodes = async (
  params: { testCodes: string[] },
  apiKey: string
): Promise<void> => {
  try {
    const url = new URL(BULK_DELETE_URL, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        testCodes: params.testCodes,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return;
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};
