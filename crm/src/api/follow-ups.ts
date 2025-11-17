import { env } from '../config/env';

export interface FollowUp {
  text: string;
  date: Date;
  adminName: string;
  id: string;
}

export interface FollowUpResponse {
  page: {
    total: number;
    currentPage: number;
    limit: number;
  };
  data: FollowUp[];
}

export const getFollowUps = async (
  {
    parentId,
    page,
    limit,
    testCode,
  }: {
    parentId: string;
    page: number;
    limit: number;
    testCode?: string;
  },
  apiKey: string
): Promise<FollowUpResponse> => {
  const url = new URL(`/crm/v1/follow-ups/${parentId}`, env.BACKEND_URL);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  if (testCode) {
    url.searchParams.set('testCode', testCode);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch follow-ups');
  }

  const data = await response.json();

  // Convert date strings to Date objects
  return {
    ...data,
    data: data.data.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    })),
  };
};

export const createFollowUp = async (
  {
    parentId,
    text,
    testCode,
  }: {
    parentId: string;
    text: string;
    testCode?: string;
  },
  apiKey: string
): Promise<FollowUp> => {
  const url = new URL(`/crm/v1/follow-ups/${parentId}`, env.BACKEND_URL);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ text, testCode }),
  });

  if (!response.ok) {
    throw new Error('Failed to create follow-up');
  }
  const data = await response.json();
  return data;
};
