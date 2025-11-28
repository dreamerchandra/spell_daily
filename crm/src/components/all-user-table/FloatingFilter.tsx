import { useState, useRef, useEffect } from 'react';
import { FilterList, Close, CalendarToday } from '@mui/icons-material';
import { StudentStatus, type AllUsersFilters } from '../../type/all-users';
import { getStudentStatusLabel } from './student-status';

interface LeadStatus {
  id: string;
  label: string;
  value: string;
}

type InternalFilterOptions = {
  search: string;
  phoneNumber: string;
  leadStatus: string;
  status?: StudentStatus;
  createdAt:
    | 'ALL'
    | 'TODAY'
    | 'YESTERDAY'
    | 'LAST_WEEK'
    | 'LAST_MONTH'
    | 'CUSTOM';
  customDateStart?: Date;
  customDateEnd?: Date;
};

interface FloatingFilterProps {
  onFilterChange: (filters: Partial<AllUsersFilters>) => void;
  leadStatuses: LeadStatus[];
  currentFilters: AllUsersFilters;
}

export const FloatingFilter: React.FC<FloatingFilterProps> = ({
  onFilterChange,
  leadStatuses,
  currentFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalFilters, setInternalFilters] = useState<InternalFilterOptions>(
    {
      search: currentFilters.q || '',
      phoneNumber: currentFilters.phoneNumber || '',
      leadStatus: currentFilters.leadStatus || '',
      status: currentFilters.status,
      createdAt: 'ALL',
    }
  );

  const filterRef = useRef<HTMLDivElement>(null);

  const convertToExternalFormat = (
    internal: InternalFilterOptions
  ): Partial<AllUsersFilters> => {
    const filters: Partial<AllUsersFilters> = {
      q: internal.search || undefined,
      phoneNumber: internal.phoneNumber || undefined,
      leadStatus: internal.leadStatus || undefined,
      status: internal.status || undefined,
      page: 0, // Reset to first page when filtering
    };

    function startOfDay(date: Date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function nextDay(date: Date) {
      const d = startOfDay(date);
      d.setDate(d.getDate() + 1);
      return d;
    }

    switch (internal.createdAt) {
      case 'TODAY': {
        const today = startOfDay(new Date());
        filters.createdAtAfter = today.toISOString();
        filters.createdAtBefore = nextDay(today).toISOString();
        break;
      }

      case 'YESTERDAY': {
        const today = startOfDay(new Date());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        filters.createdAtAfter = yesterday.toISOString();
        filters.createdAtBefore = today.toISOString();
        break;
      }

      case 'LAST_WEEK': {
        const today = startOfDay(new Date());
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        filters.createdAtAfter = lastWeek.toISOString();
        filters.createdAtBefore = nextDay(today).toISOString();
        break;
      }

      case 'LAST_MONTH': {
        const today = startOfDay(new Date());
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        filters.createdAtAfter = lastMonth.toISOString();
        filters.createdAtBefore = nextDay(today).toISOString();
        break;
      }

      case 'CUSTOM': {
        if (internal.customDateStart) {
          const start = startOfDay(internal.customDateStart);
          filters.createdAtAfter = start.toISOString();
        }
        if (internal.customDateEnd) {
          const end = nextDay(internal.customDateEnd);
          filters.createdAtBefore = end.toISOString();
        }
        break;
      }

      default:
        // ALL → no date filter
        break;
    }

    return filters;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (
    key: keyof InternalFilterOptions,
    value: string | Date | null
  ) => {
    const newInternalFilters = { ...internalFilters, [key]: value };
    setInternalFilters(newInternalFilters);
    onFilterChange(convertToExternalFormat(newInternalFilters));
  };

  const handleCustomDateStartChange = (date: string) => {
    const customDateStart = new Date(date);
    const newInternalFilters = {
      ...internalFilters,
      createdAt: 'CUSTOM' as const,
      customDateStart,
    };
    setInternalFilters(newInternalFilters);
    onFilterChange(convertToExternalFormat(newInternalFilters));
  };

  const handleCustomDateEndChange = (date: string) => {
    const customDateEnd = new Date(date);
    const newInternalFilters = {
      ...internalFilters,
      createdAt: 'CUSTOM' as const,
      customDateEnd,
    };
    setInternalFilters(newInternalFilters);
    onFilterChange(convertToExternalFormat(newInternalFilters));
  };

  const resetFilters = () => {
    const resetInternalFilters: InternalFilterOptions = {
      search: '',
      phoneNumber: '',
      leadStatus: '',
      createdAt: 'ALL',
    };
    setInternalFilters(resetInternalFilters);
    onFilterChange({
      q: undefined,
      phoneNumber: undefined,
      leadStatus: undefined,
      createdAtAfter: undefined,
      createdAtBefore: undefined,
      page: 0,
    });
  };

  const hasActiveFilters =
    internalFilters.search !== '' ||
    internalFilters.phoneNumber !== '' ||
    internalFilters.leadStatus !== '' ||
    internalFilters.createdAt !== 'ALL';

  const activeFilterCount = [
    internalFilters.search !== '',
    internalFilters.phoneNumber !== '',
    internalFilters.leadStatus !== '',
    internalFilters.createdAt !== 'ALL',
  ].filter(Boolean).length;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
            ${
              hasActiveFilters
                ? 'bg-accent-blue text-white shadow-accent-blue/50'
                : 'bg-app-secondary text-app-primary hover:bg-app-hover border border-app-hover'
            }
          `}
        >
          {isOpen ? <Close /> : <FilterList />}
          {hasActiveFilters && !isOpen && (
            <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          ref={filterRef}
          className="fixed bottom-24 right-6 w-80 bg-app-secondary rounded-lg shadow-xl border border-app-hover z-20 p-4 max-h-96 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-app-primary">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-accent-red hover:text-red-400 transition-colors"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Search (Name, Phone, Test Code)
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={internalFilters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="w-full p-2 bg-app rounded border border-app-hover text-app-primary placeholder-app-secondary focus:outline-none focus:border-accent-blue text-sm"
            />
          </div>

          {/* Phone Number Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Phone Number..."
              value={internalFilters.phoneNumber}
              onChange={e => handleFilterChange('phoneNumber', e.target.value)}
              className="w-full p-2 bg-app rounded border border-app-hover text-app-primary placeholder-app-secondary focus:outline-none focus:border-accent-blue text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Student Status
            </label>
            <select
              value={internalFilters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="w-full p-2 bg-app rounded border border-app-hover text-app-primary focus:outline-none focus:border-accent-blue text-sm"
            >
              <option value="">All</option>
              {StudentStatus.map(status => (
                <option key={status} value={status}>
                  {getStudentStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          {/* Lead Status Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Lead Status
            </label>
            <select
              value={internalFilters.leadStatus}
              onChange={e => handleFilterChange('leadStatus', e.target.value)}
              className="w-full p-2 bg-app rounded border border-app-hover text-app-primary focus:outline-none focus:border-accent-blue text-sm"
            >
              <option value="">All Status</option>
              {leadStatuses?.map(status => (
                <option key={status.id} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Created Date Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Created Date
            </label>
            <select
              value={internalFilters.createdAt}
              onChange={e => handleFilterChange('createdAt', e.target.value)}
              className="w-full p-2 bg-app rounded border border-app-hover text-app-primary focus:outline-none focus:border-accent-blue text-sm"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_WEEK">Last 7 Days</option>
              <option value="LAST_MONTH">Last 30 Days</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {internalFilters.createdAt === 'CUSTOM' && (
            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-app-primary mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    onChange={e => handleCustomDateStartChange(e.target.value)}
                    className="w-full p-2 bg-app rounded border border-app-hover text-app-primary focus:outline-none focus:border-accent-blue text-sm"
                  />
                  <CalendarToday className="absolute right-3 top-2.5 text-app-secondary pointer-events-none w-4 h-4" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-app-primary mb-2">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    onChange={e => handleCustomDateEndChange(e.target.value)}
                    className="w-full p-2 bg-app rounded border border-app-hover text-app-primary focus:outline-none focus:border-accent-blue text-sm"
                  />
                  <CalendarToday className="absolute right-3 top-2.5 text-app-secondary pointer-events-none w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="text-xs text-app-secondary mt-4 p-2 bg-app rounded border-l-4 border-accent-blue">
              <div className="font-medium text-accent-blue mb-1">
                {activeFilterCount} filter(s) active
              </div>
              <div className="space-y-1">
                {internalFilters.search && (
                  <div>Search: "{internalFilters.search}"</div>
                )}
                {internalFilters.phoneNumber && (
                  <div>Phone: {internalFilters.phoneNumber}</div>
                )}
                {internalFilters.leadStatus && (
                  <div>
                    Status:{' '}
                    {leadStatuses?.find(
                      s => s.value === internalFilters.leadStatus
                    )?.label || internalFilters.leadStatus}
                  </div>
                )}
                {internalFilters.createdAt !== 'ALL' && (
                  <div>
                    Date:{' '}
                    {internalFilters.createdAt.replace('_', ' ').toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
