import { useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { UserCard } from '../../components/user-card';
import { Search } from './search';
import {
  FloatingFilter,
  type FilterOptions,
} from '../../components/FloatingFilter';
import { useDormantUser } from '../../hooks/useUsers';
import { useDebounce } from '../../hooks/useDebounce';

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Home() {
  const { user } = useTelegram();
  const [searchValue, setSearchValue] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    userAdmin: 'ALL',
    lastAccess: 'ALL',
  });

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
    <div className="min-h-screen bg-app text-app-primary">
      <div className="mx-auto">
        <div className="py-4 px-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">👋</div>

            <div className="flex-1">
              <div className="text-sm font-medium text-white-50">
                {getTimeOfDay()}
              </div>
              <div className="text-lg font-semibold text-white-70">
                Hi, {user?.first_name || 'User'}
              </div>
            </div>
          </div>
        </div>

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
                  handleItemClick={() => {}}
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
    </div>
  );
}
