import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTelegram } from '../../hooks/useTelegram';
import {
  fetchParentUsers,
  addParentUsers,
  editTestCode,
  type AddParentForm,
  deleteTestCode,
  deleteBulkTestCodes,
} from '../../api/parent-users';

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
    mutationFn: (params: AddParentForm) =>
      addParentUsers({ parentId, ...params }, initData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'parent', parentId],
      });
    },
  });
};

export const useEditTestCode = ({ oldTestCode }: { oldTestCode: string }) => {
  const { initData } = useTelegram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AddParentForm) =>
      editTestCode({ oldTestCode, ...params }, initData),
    onSuccess: response => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'parent', response.parentId],
      });
    },
  });
};

export const useDeleteTestCode = ({
  oldTestCode,
  parentId,
}: {
  oldTestCode: string;
  parentId: string;
}) => {
  const { initData } = useTelegram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTestCode({ oldTestCode }, initData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', 'parent', parentId],
      });
    },
  });
};

export const useBulkDeleteTestCodes = ({
  parentId,
}: {
  parentId?: string;
} = {}) => {
  const { initData } = useTelegram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testCodes: string[]) =>
      deleteBulkTestCodes({ testCodes }, initData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: parentId
          ? ['users', 'parent', parentId]
          : ['users', 'parent'],
      });
      queryClient.invalidateQueries({
        queryKey: ['users', 'dormant'],
      });
    },
  });
};
