import { env } from '../config/env';
export const markFollowUpApi = async (params: {
  parentId: string;
  testCode: string;
  notes: string;
  apiKey: string;
}) => {
  const url = new URL(`/crm/v1/follow-ups`, env.BACKEND_URL);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to mark follow-up');
  }
};
