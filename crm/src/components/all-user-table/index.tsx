import React, { useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
} from '@mui/material';
import { PushPin } from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { FloatingFilter } from './FloatingFilter';
import { ColumnManager } from './ColumnManager';
import { useColumnManagement } from './useColumnManagement';
import { useDebounce } from './useDebounce';
import type { AllUsersData, AllUsersFilters } from '../../type/all-users';
import {
  fetchAllUsers,
  fetchLeadStatuses,
  updateLeadStatus,
} from '../../api/all-users';
import { LeadStatusEditor } from './lead-status';
import {
  ParentUserRender,
  PhoneNumberRender,
  TestCodeRender,
} from './cell-render';

interface Column {
  id: keyof AllUsersData | 'parentNameDetail' | 'assignedAdmin' | 'grade';
  label: string;
  minWidth?: number;
  sortable?: boolean;
  pinnable?: boolean;
  defaultPinned?: boolean;
  render?: (row: AllUsersData) => React.ReactNode;
}

const originalColumns: Column[] = [
  {
    id: 'parentNameDetail',
    label: 'Parent Name',
    minWidth: 200,
    defaultPinned: true,
    pinnable: true,
    render: row => <ParentUserRender row={row} />,
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    minWidth: 130,
    pinnable: true,
    render: row => <PhoneNumberRender row={row} />,
  },
  {
    id: 'leadStatus',
    label: 'Lead Status',
    minWidth: 120,
    pinnable: true,
    render: (row: AllUsersData) => (
      <span
        className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
        ${
          row.leadStatus === 'paid'
            ? 'bg-green-900/20 text-green-400 border-green-400/30'
            : row.leadStatus === 'free_trial'
              ? 'bg-yellow-900/20 text-yellow-400 border-yellow-400/30'
              : row.leadStatus === 'lead'
                ? 'bg-blue-900/20 text-blue-400 border-blue-400/30'
                : 'bg-gray-900/20 text-gray-400 border-gray-400/30'
        }
      `}
      >
        {row.leadStatus}
      </span>
    ),
  },
  {
    id: 'testCode',
    label: 'Test Code',
    minWidth: 120,
    pinnable: true,
    render: row => <TestCodeRender row={row} />,
  },
  {
    id: 'lastFollowupAt',
    label: 'LastFollowDate',
    minWidth: 130,
    sortable: true,
    pinnable: true,
    render: (row: AllUsersData) =>
      row.lastFollowupAt
        ? new Date(row.lastFollowupAt).toLocaleDateString()
        : '-',
  },
  {
    id: 'studentName',
    label: 'Student Name',
    minWidth: 150,
    pinnable: true,
    render: row => <TestCodeRender row={row} />,
  },
  {
    id: 'createdAt',
    label: 'Created At',
    minWidth: 130,
    sortable: true,
    pinnable: true,
    render: (row: AllUsersData) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    id: 'lastAttendedAt',
    label: 'Last Attended At',
    minWidth: 150,
    pinnable: true,
    render: (row: AllUsersData) =>
      row.lastAttendedAt
        ? new Date(row.lastAttendedAt).toLocaleDateString()
        : '-',
  },
  {
    id: 'assignedAdmin',
    label: 'Assigned Admin',
    minWidth: 150,
    pinnable: true,
    render: (row: AllUsersData) => row.admin.name,
  },
  {
    id: 'grade',
    label: 'Grade',
    minWidth: 150,
    pinnable: true,
    render: (row: AllUsersData) => row.grade,
  },
];

interface AllUsersTableProps {
  apiKey: string;
}

export const AllUsersTable: React.FC<AllUsersTableProps> = ({ apiKey }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Column management
  const {
    orderedColumns: columns,
    pinnedColumnsSet,
    handleColumnsChange,
  } = useColumnManagement(originalColumns);

  // Dark theme colors from tailwind config
  const darkTheme = useMemo(
    () => ({
      background: {
        app: '#111827',
        secondary: '#1f2937',
        hover: '#374151',
        paper: '#1f2937',
      },
      text: {
        primary: '#ffffff',
        secondary: '#9ca3af',
        accent: '#60a5fa',
      },
      colors: {
        primary: '#3b82f6',
        accent: {
          blue: '#60a5fa',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
    }),
    []
  );

  // Get filters from URL
  const getFiltersFromUrl = useCallback((): AllUsersFilters => {
    const filters: AllUsersFilters = {};

    const q = searchParams.get('q');
    if (q) filters.q = q;

    const phoneNumber = searchParams.get('phoneNumber');
    if (phoneNumber) filters.phoneNumber = phoneNumber;

    const leadStatus = searchParams.get('leadStatus');
    if (leadStatus) filters.leadStatus = leadStatus;

    const page = searchParams.get('page');
    if (page) filters.page = parseInt(page, 10);

    const limit = searchParams.get('limit');
    if (limit) filters.limit = parseInt(limit, 10);

    const createdAtAfter = searchParams.get('createdAtAfter');
    if (createdAtAfter) filters.createdAtAfter = createdAtAfter;

    const createdAtBefore = searchParams.get('createdAtBefore');
    if (createdAtBefore) filters.createdAtBefore = createdAtBefore;

    return filters;
  }, [searchParams]);

  const filters = getFiltersFromUrl();

  // Separate search filters (q, phoneNumber) from other filters for debouncing
  const searchFilters = useMemo(
    () => ({
      q: filters.q,
      phoneNumber: filters.phoneNumber,
    }),
    [filters.q, filters.phoneNumber]
  );

  const nonSearchFilters = useMemo(
    () => ({
      leadStatus: filters.leadStatus,
      createdAtAfter: filters.createdAtAfter,
      createdAtBefore: filters.createdAtBefore,
      page: filters.page,
      limit: filters.limit,
    }),
    [
      filters.leadStatus,
      filters.createdAtAfter,
      filters.createdAtBefore,
      filters.page,
      filters.limit,
    ]
  );

  const debouncedSearchFilters = useDebounce(searchFilters, 300);

  const isSearchPending = useMemo(() => {
    return (
      searchFilters.q !== debouncedSearchFilters.q ||
      searchFilters.phoneNumber !== debouncedSearchFilters.phoneNumber
    );
  }, [searchFilters, debouncedSearchFilters]);

  const queryFilters = useMemo(
    () => ({
      ...debouncedSearchFilters,
      ...nonSearchFilters,
    }),
    [debouncedSearchFilters, nonSearchFilters]
  );

  const page = queryFilters.page || 0;
  const limit = queryFilters.limit || 10;
  const orderBy = searchParams.get('orderBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<AllUsersFilters>) => {
      const updatedParams = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          updatedParams.set(key, value.toString());
        } else {
          updatedParams.delete(key);
        }
      });

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );

  // Fetch data with debounced filters
  const { data: usersData, isFetching } = useQuery({
    queryKey: ['allUsers', queryFilters, orderBy, order],
    queryFn: () =>
      fetchAllUsers(
        {
          ...queryFilters,
          page,
          offset: page * limit,
          limit,
        },
        apiKey
      ),
    // Keep previous data while fetching new data (React Query v5)
    placeholderData: previousData => previousData,
  });

  const { data: leadStatuses } = useQuery({
    queryKey: ['leadStatuses'],
    queryFn: () => fetchLeadStatuses(apiKey),
  });

  // Handle sorting
  const handleSort = useCallback(
    (column: string) => {
      const isAsc = orderBy === column && order === 'asc';
      const newOrder = isAsc ? 'desc' : 'asc';

      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.set('orderBy', column);
      updatedParams.set('order', newOrder);
      setSearchParams(updatedParams);
    },
    [orderBy, order, searchParams, setSearchParams]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (_: unknown, newPage: number) => {
      updateFilters({ page: newPage });
    },
    [updateFilters]
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLimit = parseInt(event.target.value, 10);
      updateFilters({ limit: newLimit, page: 0 });
    },
    [updateFilters]
  );

  // Handle lead status update
  const handleLeadStatusUpdate = useCallback(
    async (testCode: string, newStatus: string) => {
      try {
        await updateLeadStatus(testCode, newStatus, apiKey);
        queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    },
    [apiKey, queryClient]
  );

  return (
    <div className="bg-app text-app-primary min-h-screen p-2">
      {/* Floating Filter Component */}
      <FloatingFilter
        onFilterChange={updateFilters}
        leadStatuses={leadStatuses || []}
        currentFilters={filters}
      />

      {/* Column Management Controls */}
      <div className="bg-app-secondary border border-app-hover rounded-lg p-3 mb-4 flex items-center justify-between">
        <div className="text-sm text-app-primary">Table Configuration</div>
        <ColumnManager
          columns={originalColumns}
          onColumnsChange={handleColumnsChange}
        />
      </div>

      {/* Data Display */}
      <div className="overflow-x-auto relative">
        {/* Loading indicators */}
        {(isFetching || isSearchPending) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-accent-blue text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isSearchPending ? 'Typing...' : 'Searching...'}
          </div>
        )}

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: darkTheme.background.secondary,
            border: `1px solid ${darkTheme.background.hover}`,
            borderRadius: 2,
            overflow: 'hidden',
            minWidth: '800px',
            opacity: isFetching ? 0.7 : 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
          style={{
            width: 'fit-content',
          }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={String(column.id)}
                    sx={{
                      minWidth: column.minWidth,
                      backgroundColor: pinnedColumnsSet.has(String(column.id))
                        ? darkTheme.background.hover
                        : darkTheme.background.app,
                      borderBottom: `1px solid ${darkTheme.background.hover}`,
                      color: darkTheme.text.primary,
                      padding: '16px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={
                          orderBy === column.id
                            ? (order as 'asc' | 'desc')
                            : 'asc'
                        }
                        onClick={() => handleSort(String(column.id))}
                        sx={{
                          color: darkTheme.text.primary,
                          '&:hover': {
                            color: darkTheme.colors.accent.blue,
                          },
                          '&.Mui-active': {
                            color: darkTheme.colors.accent.blue,
                            '& .MuiTableSortLabel-icon': {
                              color: darkTheme.colors.accent.blue,
                            },
                          },
                        }}
                      >
                        <span className="font-medium text-sm">
                          {column.label}
                        </span>
                        {pinnedColumnsSet.has(String(column.id)) && (
                          <PushPin
                            fontSize="small"
                            sx={{
                              ml: 0.5,
                              color: darkTheme.colors.accent.blue,
                            }}
                          />
                        )}
                      </TableSortLabel>
                    ) : (
                      <div className="flex items-center">
                        <span className="font-medium text-white-100 text-sm">
                          {column.label}
                        </span>
                        {pinnedColumnsSet.has(String(column.id)) && (
                          <PushPin
                            fontSize="small"
                            className="ml-2 text-accent-blue"
                          />
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.data.map(row => (
                <TableRow
                  key={row.testCode}
                  sx={{
                    backgroundColor: darkTheme.background.secondary,
                    '&:hover': {
                      backgroundColor: darkTheme.background.hover,
                    },
                    '&:nth-of-type(odd)': {
                      backgroundColor: darkTheme.background.app,
                      '&:hover': {
                        backgroundColor: darkTheme.background.hover,
                      },
                    },
                  }}
                >
                  {columns.map(column => (
                    <TableCell
                      key={String(column.id)}
                      sx={{
                        backgroundColor: pinnedColumnsSet.has(String(column.id))
                          ? 'rgba(96, 165, 250, 0.1)'
                          : 'transparent',
                        borderBottom: `1px solid ${darkTheme.background.hover}`,
                        color: darkTheme.text.primary,
                        padding: '12px 16px',
                      }}
                    >
                      {column.id === 'leadStatus' ? (
                        <LeadStatusEditor
                          darkTheme={darkTheme}
                          row={row}
                          handleLeadStatusUpdate={handleLeadStatusUpdate}
                          leadStatuses={leadStatuses}
                          key={String(column.id)}
                        />
                      ) : column.render ? (
                        column.render(row)
                      ) : (
                        <span className="text-white-100 text-sm">
                          {String(row[column.id as keyof AllUsersData] || '')}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Debounce Status */}
      {isSearchPending && (
        <div className="bg-yellow-900/20 border border-yellow-400/30 text-yellow-400 px-3 py-2 text-sm rounded-t-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          Search filters will be applied shortly...
        </div>
      )}

      {/* Pagination */}
      <TablePagination
        component="div"
        count={usersData?.page.total || 0}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        sx={{
          backgroundColor: darkTheme.background.secondary,
          border: `1px solid ${darkTheme.background.hover}`,
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          color: darkTheme.text.primary,
          '& .MuiTablePagination-toolbar': {
            color: darkTheme.text.primary,
          },
          '& .MuiTablePagination-selectLabel': {
            color: darkTheme.text.secondary,
          },
          '& .MuiTablePagination-displayedRows': {
            color: darkTheme.text.secondary,
          },
          '& .MuiTablePagination-select': {
            color: darkTheme.text.primary,
            backgroundColor: darkTheme.background.app,
          },
          '& .MuiTablePagination-actions button': {
            color: darkTheme.text.secondary,
            '&:hover': {
              backgroundColor: darkTheme.background.hover,
              color: darkTheme.text.primary,
            },
            '&.Mui-disabled': {
              color: darkTheme.background.hover,
            },
          },
          '& .MuiSelect-icon': {
            color: darkTheme.text.secondary,
          },
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                backgroundColor: darkTheme.background.secondary,
                border: `1px solid ${darkTheme.background.hover}`,
                '& .MuiMenuItem-root': {
                  color: darkTheme.text.primary,
                  '&:hover': {
                    backgroundColor: darkTheme.background.hover,
                  },
                  '&.Mui-selected': {
                    backgroundColor: darkTheme.colors.primary + '20',
                    '&:hover': {
                      backgroundColor: darkTheme.colors.primary + '30',
                    },
                  },
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
