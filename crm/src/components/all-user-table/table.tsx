import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { PushPin } from '@mui/icons-material';
import type { AllUsersData, AllUsersResponse } from '../../type/all-users';
import { darkTheme } from './cell-render';

export const InternalTable = ({
  columns,
  usersData,
  orderBy,
  order,
  handleSort,
  pinnedColumnsSet,
  isFetching,
}: {
  columns: {
    id: keyof AllUsersData | string;
    label: string;
    minWidth?: number;
    sortable?: boolean;
    render?: (row: AllUsersData) => React.ReactNode;
  }[];
  usersData: AllUsersResponse | undefined;
  orderBy: string;
  order: 'asc' | 'desc';
  handleSort: (columnId: string) => void;
  pinnedColumnsSet: Set<string>;
  isFetching: boolean;
}) => {
  if (!usersData || usersData.data.length === 0) {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          color: darkTheme.text.primary,
          backgroundColor: darkTheme.background.secondary,
          border: `1px solid ${darkTheme.background.hover}`,
          borderRadius: '8px',
        }}
      >
        No data available.
      </div>
    );
  }
  return (
    <TableContainer
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
                      orderBy === column.id ? (order as 'asc' | 'desc') : 'asc'
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
                    <span className="font-medium text-sm">{column.label}</span>
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
                  {column.render ? (
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
  );
};
