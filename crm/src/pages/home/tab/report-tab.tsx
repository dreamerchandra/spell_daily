import { UserCard } from '../../../components/user-card';
import { Search } from '../search';
import {
  FloatingFilter,
  type FilterOptions,
} from '../../../components/FloatingFilter';
import { useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import { useDormantUser } from '../useDormantUsers';
import { SelectableCardProvider } from '../../../components/SelectableCard';
import Button from '../../../components/Button';
import { DeleteOutline } from '@mui/icons-material';
import { useBulkDeleteTestCodes } from '../../code-generator/useParentUsers';
import { useSelectionContext } from '../../../hooks/useSelectionContext';

const BulkSelectActions = () => {
  const { selectedIds, hasSelections, clearSelections } = useSelectionContext();
  const { mutateAsync: bulkDelete } = useBulkDeleteTestCodes();

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds);
    clearSelections();
    return;
  };

  if (!hasSelections) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-50 border-t border-primary-200 shadow-lg">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <span className="text-primary-700 font-medium">
          {selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''}{' '}
          selected
        </span>
        <div className="flex gap-2">
          <Button variant="text" size="sm" onClick={clearSelections}>
            Clear
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleBulkDelete}
            icon={<DeleteOutline className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ReportTab = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    userAdmin: 'ALL',
    lastAccess: 'ALL',
  });

  const navigate = useNavigate();
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useDormantUser({
    filters,
    searchQuery: debouncedSearchValue,
  });
  return (
    <SelectableCardProvider>
      <div className="mx-auto">
        <div className="sticky top-0 z-10 bg-app">
          <Search onChange={value => setSearchValue(value || '')} />
        </div>

        <div className="px-6">
          <h2 className="text-lg font-semibold mb-4 text-app-primary">
            Pending Tests
            {usersResponse && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({usersResponse.users.length} of {usersResponse.total})
              </span>
            )}
          </h2>

          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading users...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-400">
                <p>Failed to load users</p>
                <p className="text-sm text-gray-500 mt-1">
                  {error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'}
                </p>
              </div>
            ) : usersResponse?.users.length ? (
              usersResponse.users.map((userItem, index) => (
                <UserCard
                  user={userItem}
                  key={`${userItem.testCode}-${index}`}
                  handleItemClick={() => {
                    navigate(`/analytics/${userItem.testCode}`);
                  }}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No users found matching the current filters
              </div>
            )}
          </div>
        </div>

        <FloatingFilter onFilterChange={setFilters} />
      </div>
      <BulkSelectActions />
    </SelectableCardProvider>
  );
};
