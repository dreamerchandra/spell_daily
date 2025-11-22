import {
  FloatingFilter,
  type FilterOptions,
} from '../../../components/FloatingFilter';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDormantUser } from '../useDormantUsers';
import { SelectableCardProvider } from '../../../components/SelectableCard';
import Button from '../../../components/Button';
import { DeleteOutline } from '@mui/icons-material';
import { useBulkDeleteTestCodes } from '../../code-generator/useParentUsers';
import { useSelectionContext } from '../../../hooks/useSelectionContext';
import { QuickDateFilter } from '../../../components/QuickDateFilter';
import { useAllTestCodes } from '../../../hooks/useAllTestCode';
import { FilterClip, type Filter } from '../../../components/filter-clip';

type RenderUsers = {
  testCode: string;
};
const UserList = ({
  users,
  handleItemClick,
}: {
  users: Array<RenderUsers>;
  handleItemClick: (testCode: string) => void;
}) => {
  return (
    <div className="overflow-y-auto flex flex-col h-100%">
      {users.length ? (
        users.map(userItem => (
          <Button
            size="sm"
            key={`user-${userItem.testCode}`}
            variant="text"
            onClick={() => handleItemClick(userItem.testCode)}
          >
            {userItem.testCode}
          </Button>
        ))
      ) : (
        <div className="text-center py-4 text-gray-400 text-sm">
          No free trial users
        </div>
      )}
    </div>
  );
};

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

const getNotCompletedDate = () => {
  const now = new Date();
  if (now.getHours() >= 11) {
    return now;
  } else {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return yesterday;
  }
};

const KanbanList = ({
  usersResponse,
}: {
  usersResponse: {
    freeTrial: RenderUsers[];
    paid: RenderUsers[];
    dict: RenderUsers[];
  };
}) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-3 gap-1">
      {/* Dict Users Column */}
      <div className=" rounded-lg p-4">
        <h3 className="text-md font-medium mb-3 text-purple-600 border-b border-purple-200 pb-2 text-nowrap">
          Dict ({usersResponse.dict?.length || 0})
        </h3>
        <UserList
          users={usersResponse.dict || []}
          handleItemClick={testCode => {
            navigate(`/analytics/${testCode}`);
          }}
        />
      </div>

      {/* Free Trial Users Column */}
      <div className="rounded-lg p-4">
        <h3 className="text-md font-medium mb-3 text-blue-600 border-b border-blue-200 pb-2 text-nowrap">
          Free Trial ({usersResponse.freeTrial?.length || 0})
        </h3>
        <UserList
          users={usersResponse.freeTrial || []}
          handleItemClick={testCode => {
            navigate(`/analytics/${testCode}`);
          }}
        />
      </div>

      {/* Paid Users Column */}
      <div className="rounded-lg p-4">
        <h3 className="text-md font-medium mb-3 text-green-600 border-b border-green-200 pb-2 text-nowrap">
          Paid ({usersResponse.paid?.length || 0})
        </h3>
        <UserList
          users={usersResponse.paid || []}
          handleItemClick={testCode => {
            navigate(`/analytics/${testCode}`);
          }}
        />
      </div>
    </div>
  );
};

export const ReportTab = () => {
  const [filters, setFilters] = useState<
    FilterOptions & {
      notCompletedDate: Date;
    }
  >({
    userAdmin: 'ALL',
    lastAccess: 'ALL',
    notCompletedDate: getNotCompletedDate(),
  });
  const [chip, setChip] = useState<
    Filter<'all' | 'completed_test' | 'not_completed_test'>
  >({ label: 'All', value: 'all' });

  const handleDateChange = (date: Date) => {
    setFilters(prev => ({ ...prev, notCompletedDate: date }));
  };

  const {
    data: incompletedUsers,
    isLoading: isDormantUsersLoading,
    isError,
    error,
  } = useDormantUser({
    filters,
  });
  const { data: allTestCodes, isLoading: isLoadingTestCodes } =
    useAllTestCodes();

  const isLoading = isDormantUsersLoading || isLoadingTestCodes;

  const kanbanData = useMemo(() => {
    const completedTestCodes = {
      freeTrial:
        allTestCodes?.freeTrial.filter(
          ft =>
            !incompletedUsers?.freeTrial.find(
              urt => urt.testCode === ft.testCode
            )
        ) || [],
      paid:
        allTestCodes?.paid.filter(
          pt =>
            !incompletedUsers?.paid.find(urt => urt.testCode === pt.testCode)
        ) || [],
      dict:
        allTestCodes?.dict.filter(
          dt =>
            !incompletedUsers?.dict.find(urt => urt.testCode === dt.testCode)
        ) || [],
    };
    const users = {
      all: allTestCodes || {
        freeTrial: [],
        paid: [],
        dict: [],
      },
      completed_test: completedTestCodes,
      not_completed_test: incompletedUsers || {
        freeTrial: [],
        paid: [],
        dict: [],
      },
    };
    return users;
  }, [allTestCodes, incompletedUsers]);

  const allUserLength =
    kanbanData?.all.freeTrial.length +
    kanbanData?.all.paid.length +
    kanbanData?.all.dict.length;
  const notCompletedUserLength =
    kanbanData?.not_completed_test.freeTrial.length +
    kanbanData?.not_completed_test.paid.length +
    kanbanData?.not_completed_test.dict.length;
  const completedUserLength =
    kanbanData?.completed_test.freeTrial.length +
    kanbanData?.completed_test.paid.length +
    kanbanData?.completed_test.dict.length;

  return (
    <SelectableCardProvider>
      <div className="mx-auto">
        <QuickDateFilter
          onDateChange={handleDateChange}
          date={filters.notCompletedDate}
        />
        <div className=" p-2 border-b ">
          <FilterClip
            selected={chip}
            onChange={setChip}
            allFilters={[
              {
                label: `All ${allUserLength}`,
                value: 'all' as const,
              },
              {
                label: `Completed Test ${completedUserLength}`,
                value: 'completed_test' as const,
              },
              {
                label: `Not Completed Test ${notCompletedUserLength}`,
                value: 'not_completed_test' as const,
              },
            ]}
            defaultFilter="all"
          />
        </div>

        <div className="px-6">
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
          ) : kanbanData ? (
            <KanbanList usersResponse={kanbanData[chip.value]} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              No users found matching the current filters
            </div>
          )}
        </div>

        <FloatingFilter
          onFilterChange={filters =>
            setFilters(prev => ({ ...prev, ...filters }))
          }
        />
      </div>
      <BulkSelectActions />
    </SelectableCardProvider>
  );
};
