import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTelegram } from '../../hooks/useTelegram';
import { fetchParentUsers, addParentUsers } from '../../api/parent-users';

export interface UseUsersParams {
  parentId: string;
  enabled?: boolean;
}

export const useParentUsers = ({
  parentId,
  enabled = true,
}: UseUsersParams) => {
  const { initData } = useTelegram();

  return useQuery({
    queryKey: ['users', 'parent', parentId],
    queryFn: () => fetchParentUsers({ parentId }, initData),
    enabled: enabled && Boolean(initData),
    staleTime: 0,
    gcTime: 0,
  });
};

export const useParentAddUsers = ({ parentId }: UseUsersParams) => {
  const { initData } = useTelegram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name }: { name: string }) =>
      addParentUsers({ parentId, name }, initData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'parent', parentId],
      });
    },
  });
};
