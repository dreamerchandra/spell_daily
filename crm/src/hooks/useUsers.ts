import { useQuery } from '@tanstack/react-query';
import {
  fetchUsers,
  convertFiltersToParams,
  type UsersApiParams,
} from '../api/users';
import type { FilterOptions } from '../components/FloatingFilter';

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

  return useQuery({
    queryKey: ['users', 'dormant', params],
    queryFn: () => fetchUsers(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usersKeys = {
  all: ['users'] as const,
  dormant: () => [...usersKeys.all, 'dormant'] as const,
  dormantWithFilters: (params: UsersApiParams) =>
    [...usersKeys.dormant(), params] as const,
};
