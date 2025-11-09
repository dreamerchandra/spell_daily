import { env } from '../config/env';
import { useTelegram } from '../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  telegramId: number;
  name: string;
  createdAt: string;
}

const verifyTelegramAuth = async (initData: string): Promise<User> => {
  const response = await fetch(`${env.BACKEND_URL}/crm/v1/auth/telegram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${initData}`,
    },
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return response.json();
};

export const useAuth = () => {
  const { initData, user: telegramUser, isReady } = useTelegram();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['auth', initData],
    queryFn: () => verifyTelegramAuth(initData),
    enabled: isReady && !!initData && !!telegramUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: true,
    telegramUser,
  };
};
