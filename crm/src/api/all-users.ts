import { env } from '../config/env';
import type {
  AllUsersResponse,
  AllUsersApiParams,
  LeadStatus,
} from '../type/all-users';

const BASE_URL = '/crm/v1/all-users';
const STATUS_URL = '/crm/v1/lead-status';

export const fetchAllUsers = async (
  params: AllUsersApiParams,
  apiKey: string
): Promise<AllUsersResponse> => {
  try {
    const url = new URL(BASE_URL, env.BACKEND_URL);

    // Add query parameters
    if (params.q) url.searchParams.set('q', params.q);
    if (params.phoneNumber)
      url.searchParams.set('phoneNumber', params.phoneNumber);
    if (params.leadStatus)
      url.searchParams.set('leadStatus', params.leadStatus);
    if (params.createdAtBefore)
      url.searchParams.set('createdAtBefore', params.createdAtBefore);
    if (params.createdAtAfter)
      url.searchParams.set('createdAtAfter', params.createdAtAfter);
    if (params.page !== undefined)
      url.searchParams.set('page', params.page.toString());
    if (params.offset !== undefined)
      url.searchParams.set('offset', params.offset.toString());
    if (params.limit) url.searchParams.set('limit', params.limit.toString());
    if (params.status) url.searchParams.set('status', params.status);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};

export const fetchLeadStatuses = async (
  apiKey: string
): Promise<LeadStatus[]> => {
  try {
    const url = new URL(STATUS_URL, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};

export const updateLeadStatus = async (
  testCode: string,
  leadStatus: string,
  apiKey: string
): Promise<void> => {
  try {
    const url = new URL(`${BASE_URL}/${testCode}/status`, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadStatus }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};

export const updateStudentStatus = async (
  testCode: string,
  status: string,
  apiKey: string
): Promise<void> => {
  try {
    const url = new URL(
      `${BASE_URL}/${testCode}/student-status`,
      env.BACKEND_URL
    );

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};

const BASE_ALL_TEST_CODE_URL = '/crm/v1/all-test-users';

export interface MiniTestCodesResponse {
  testCode: string;
  phoneNumber?: string;
  status: 'PAID' | 'FREE_TRIAL' | 'DICTATION';
}

export const getAllTestCodes = async (
  apiKey: string
): Promise<MiniTestCodesResponse[]> => {
  try {
    const url = new URL(BASE_ALL_TEST_CODE_URL, env.BACKEND_URL);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API call failed:', error);
    throw error;
  }
};
