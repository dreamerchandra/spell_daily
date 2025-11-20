import { useState, useRef, useEffect } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export type FilterOptions = {
  userAdmin: 'ALL' | 'MY';
  lastAccess: number | 'ALL';
  notCompletedDate: Date;
};

type InternalFilterOptions = {
  userAdmin: 'ALL' | 'MY';
  lastAccess: 'ALL' | 'YESTERDAY' | '2_DAYS_AGO' | 'CUSTOM';
  customDate?: Date;
};

interface FloatingFilterProps {
  onFilterChange: (filters: Omit<FilterOptions, 'notCompletedDate'>) => void;
}

export const FloatingFilter: React.FC<FloatingFilterProps> = ({
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalFilters, setInternalFilters] = useState<InternalFilterOptions>(
    {
      userAdmin: 'ALL',
      lastAccess: 'ALL',
    }
  );

  const filterRef = useRef<HTMLDivElement>(null);
  const customDateRef = useRef<HTMLInputElement>(null);

  const convertToExternalFormat = (
    internal: InternalFilterOptions
  ): Omit<FilterOptions, 'notCompletedDate'> => {
    let lastAccess: number | 'ALL' = 'ALL';

    switch (internal.lastAccess) {
      case 'YESTERDAY': {
        lastAccess = 0;
        break;
      }
      case '2_DAYS_AGO': {
        lastAccess = 1;
        break;
      }
      case 'CUSTOM': {
        const selectedDate = internal.customDate
          ? internal.customDate
          : new Date();
        const now = new Date();
        const selectDateMidnight = selectedDate.setHours(0, 0, 0, 0);
        const nowMidnight = now.setHours(0, 0, 0, 0);
        const diffTime = nowMidnight - selectDateMidnight;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        lastAccess = diffDays;
        break;
      }
      default:
        lastAccess = 'ALL';
    }

    return {
      userAdmin: internal.userAdmin,
      lastAccess,
    };
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
    value: string | Date
  ) => {
    const newInternalFilters = { ...internalFilters, [key]: value };
    setInternalFilters(newInternalFilters);
    onFilterChange(convertToExternalFormat(newInternalFilters));
  };

  const handleCustomDateChange = (date: string) => {
    const customDate = new Date(date);
    const newInternalFilters = {
      ...internalFilters,
      lastAccess: 'CUSTOM' as const,
      customDate,
    };
    setInternalFilters(newInternalFilters);
    onFilterChange(convertToExternalFormat(newInternalFilters));
  };

  const resetFilters = () => {
    const resetInternalFilters: InternalFilterOptions = {
      userAdmin: 'ALL',
      lastAccess: 'ALL',
    };
    setInternalFilters(resetInternalFilters);
    onFilterChange(convertToExternalFormat(resetInternalFilters));
  };

  const hasActiveFilters =
    internalFilters.userAdmin !== 'ALL' || internalFilters.lastAccess !== 'ALL';

  return (
    <>
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
            ${
              hasActiveFilters
                ? 'bg-primary-500 text-white'
                : 'bg-app-secondary text-app-primary hover:bg-opacity-80'
            }
          `}
        >
          {isOpen ? <CloseIcon /> : <FilterListIcon />}
        </button>
      </div>

      {isOpen && (
        <div
          ref={filterRef}
          className="fixed bottom-24 right-6 w-80 bg-app-secondary rounded-lg shadow-xl border border-gray-600 z-20 p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-app-primary">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-primary-500 hover:text-primary-400"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Admin
            </label>
            <select
              value={internalFilters.userAdmin}
              onChange={e => handleFilterChange('userAdmin', e.target.value)}
              className="w-full p-2 bg-app rounded border border-gray-600 text-app-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All</option>
              <option value="MY">My Students</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-app-primary mb-2">
              Last Access
            </label>
            <select
              value={internalFilters.lastAccess}
              onChange={e => handleFilterChange('lastAccess', e.target.value)}
              className="w-full p-2 bg-app rounded border border-gray-600 text-app-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="2_DAYS_AGO">2 Days Ago</option>
              <option value="CUSTOM">Custom Date</option>
            </select>
          </div>

          {internalFilters.lastAccess === 'CUSTOM' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-app-primary mb-2">
                Select Date
              </label>
              <div className="relative">
                <input
                  ref={customDateRef}
                  type="date"
                  onChange={e => handleCustomDateChange(e.target.value)}
                  className="w-full p-2 bg-app rounded border border-gray-600 text-app-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <CalendarTodayIcon className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="text-xs text-gray-400 mt-2">
              {
                [
                  internalFilters.userAdmin !== 'ALL' &&
                    `Admin: ${internalFilters.userAdmin}`,
                  internalFilters.lastAccess !== 'ALL' &&
                    `Access: ${internalFilters.lastAccess}`,
                ].filter(Boolean).length
              }{' '}
              filter(s) active
            </div>
          )}
        </div>
      )}
    </>
  );
};
