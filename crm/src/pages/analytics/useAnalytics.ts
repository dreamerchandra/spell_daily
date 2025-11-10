import { useQuery } from '@tanstack/react-query';
import { env } from '../../config/env';
import { useTelegram } from '../../hooks/useTelegram';

export type DailyUsage = {
  startedAt: Date;
  partialCompletion: Date[];
  notStarted: Date[];
  followUpDates: Date[];
  parent?: {
    id: string;
    phoneNumber: string;
    name?: string | null;
    details: string[];
    adminId: string;
    adminName?: string;
  };
};

export interface UseAnalyticsParams {
  testCode: string;
  month: number;
  year: number;
}

const fetchAnalytics = async (
  params: UseAnalyticsParams,
  initData: string
): Promise<DailyUsage> => {
  try {
    const url = new URL(
      `/crm/v1/analytics/${params.testCode}`,
      env.BACKEND_URL
    );
    url.searchParams.append('month', params.month.toString());
    url.searchParams.append('year', params.year.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${initData}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const _data = await response.json();
    const data = _data.data;
    const parent = _data.testCodeDetails?.parent;
    return {
      startedAt: new Date(data.startedAt),
      partialCompletion: data.partialCompletion.map(
        (date: string) => new Date(date)
      ),
      notStarted: data.notStarted.map((date: string) => new Date(date)),
      followUpDates: data.followUpDates.map((date: string) => new Date(date)),
      parent: parent
        ? {
            id: parent.id,
            phoneNumber: parent.phoneNumber,
            name: parent.name,
            details: parent.details,
            adminId: parent.adminId,
            adminName: parent.adminName,
          }
        : undefined,
    };
  } catch (error) {
    console.warn('Analytics API call failed, using mock data:', error);
    throw error;
  }
};

export const useAnalytics = ({ testCode, month, year }: UseAnalyticsParams) => {
  const { initData } = useTelegram();
  return useQuery({
    queryKey: ['analytics', testCode, month, year],
    queryFn: () => fetchAnalytics({ testCode, month, year }, initData),
    enabled: Boolean(testCode) && Boolean(initData),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
