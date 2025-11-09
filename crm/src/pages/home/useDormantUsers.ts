import { useQuery } from '@tanstack/react-query';
import {
  fetchDormantUsers,
  convertFiltersToParams,
} from '../../api/dormant-users';
import type { FilterOptions } from '../../components/FloatingFilter';
import { useTelegram } from '../../hooks/useTelegram';

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
    queryFn: () => fetchDormantUsers(params, initData),
    enabled: enabled && Boolean(initData),
    staleTime: 0,
    gcTime: 0,
  });
};
