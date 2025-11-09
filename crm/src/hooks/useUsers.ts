import { useQuery } from '@tanstack/react-query';
import {
  fetchUsers,
  convertFiltersToParams,
  type UsersApiParams,
} from '../api/users';
import type { FilterOptions } from '../components/FloatingFilter';
import { useTelegram } from './useTelegram';

export interface UseUsersParams {
  filters: FilterOptions;
  searchQuery?: string;
  enabled?: boolean;
}

export const useDormantUser = ({
  filters,
  searchQuery,
  enabled = true,
}: UseUsersParams) => {
  const params = convertFiltersToParams(filters, searchQuery);
  const { initData } = useTelegram();

  return useQuery({
    queryKey: ['users', 'dormant', params],
    queryFn: () => fetchUsers(params, initData),
    enabled: enabled && Boolean(initData),
    staleTime: 0,
    gcTime: 0,
  });
};

export const usersKeys = {
  all: ['users'] as const,
  dormant: () => [...usersKeys.all, 'dormant'] as const,
  dormantWithFilters: (params: UsersApiParams) =>
    [...usersKeys.dormant(), params] as const,
};
