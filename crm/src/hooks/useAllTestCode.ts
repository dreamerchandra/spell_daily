import { useQuery } from '@tanstack/react-query';
import { getAllTestCodes } from '../api/all-users';
import { useTelegram } from './useTelegram';

export const useAllTestCodes = () => {
  const { initData } = useTelegram();
  return useQuery({
    queryKey: ['all-test-codes'],
    queryFn: async () => {
      const data = await getAllTestCodes(initData);
      const response = {
        freeTrial: data.filter(item => item.status === 'FREE_TRIAL'),
        paid: data.filter(item => item.status === 'PAID'),
        dict: data.filter(item => item.status === 'DICTATION'),
      };
      return response;
    },
    enabled: !!initData,
    refetchOnWindowFocus: false,
  });
};
