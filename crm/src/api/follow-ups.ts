import { env } from '../config/env';

export interface FollowUp {
  text: string;
  date: Date;
  adminName: string;
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
  parentId: string,
  page: number,
  limit: number,
  apiKey: string
): Promise<FollowUpResponse> => {
  const url = new URL(`/crm/v1/follow-ups/${parentId}`, env.BACKEND_URL);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

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
  parentId: string,
  text: string,
  apiKey: string
): Promise<void> => {
  const url = new URL(`/crm/v1/follow-ups/${parentId}`, env.BACKEND_URL);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to create follow-up');
  }
};
