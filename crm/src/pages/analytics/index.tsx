import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAnalytics } from './useAnalytics.ts';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Analytics() {
  const { testCode } = useParams<{ testCode: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    data: analyticsData,
    isLoading,
    isError,
    error,
  } = useAnalytics({
    testCode: testCode!,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  const startedDate = analyticsData?.startedAt
    ? new Date(analyticsData.startedAt)
    : null;

  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || dates.length % 7 !== 0) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const getDateStatus = (date: Date) => {
    if (!analyticsData) return null;

    const dateStr = date.toDateString();
    const statuses: string[] = [];

    if (
      analyticsData.partialCompletion.some(
        (d: Date) => d.toDateString() === dateStr
      )
    ) {
      statuses.push('partial');
    }
    if (
      analyticsData.notStarted.some((d: Date) => d.toDateString() === dateStr)
    ) {
      statuses.push('notStarted');
    }
    if (
      analyticsData.followUpDates.some(
        (d: Date) => d.toDateString() === dateStr
      )
    ) {
      statuses.push('followUp');
    }

    return statuses;
  };

  const getDateCellClass = (date: Date, statuses: string[] | null) => {
    const baseClass =
      'w-10 h-10 flex items-center justify-center text-sm rounded-lg relative';
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isDisabled = startedDate && date < startedDate;
    const isToday = date.toDateString() === new Date().toDateString();

    let classes = baseClass;

    if (isDisabled) {
      classes += ' text-gray-500 cursor-not-allowed';
    } else if (!isCurrentMonth) {
      classes += ' text-gray-400';
    } else {
      classes += ' text-app-primary';
    }

    if (isToday && !isDisabled) {
      classes += ' ring-2 ring-primary-500';
    }

    if (statuses && statuses.length > 0 && !isDisabled) {
      if (statuses.length === 1) {
        switch (statuses[0]) {
          case 'partial':
            classes += ' bg-yellow-500 text-black';
            break;
          case 'notStarted':
            classes += ' bg-red-500 text-white';
            break;
          case 'followUp':
            classes += ' bg-blue-500 text-white';
            break;
        }
      } else {
        classes += ' bg-gray-600';
      }
    }

    return classes;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }

    // Don't allow navigation before started month
    if (startedDate) {
      const startedMonth = new Date(
        startedDate.getFullYear(),
        startedDate.getMonth(),
        1
      );
      const targetMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        1
      );
      if (direction === 'prev' && targetMonth < startedMonth) {
        return;
      }
    }

    setCurrentDate(newDate);
  };

  const canNavigatePrev = () => {
    if (!startedDate) return true;
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startedMonth = new Date(
      startedDate.getFullYear(),
      startedDate.getMonth(),
      1
    );
    return currentMonth > startedMonth;
  };

  const dates = getDatesInMonth(currentDate);

  return (
    <div className="min-h-screen bg-app text-app-primary">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-app-primary mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Test Code:{' '}
            <span className="text-app-primary font-semibold">{testCode}</span>
          </p>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-app-secondary rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              disabled={!canNavigatePrev()}
              className="p-2 rounded-lg hover:bg-app transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft />
            </button>

            <h2 className="text-xl font-semibold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-app transition-colors"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading calendar...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-400">
              <p>Failed to load analytics data</p>
              <p className="text-sm text-gray-500 mt-1">
                {error instanceof Error
                  ? error.message
                  : 'Unknown error occurred'}
              </p>
            </div>
          ) : (
            <>
              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(day => (
                  <div
                    key={day}
                    className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {dates.map((date, index) => {
                  const statuses = getDateStatus(date);
                  const hasMultipleEvents = statuses && statuses.length > 1;

                  return (
                    <div
                      key={index}
                      className={getDateCellClass(date, statuses)}
                    >
                      {date.getDate()}
                      {hasMultipleEvents && (
                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-app-secondary rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Partial Completion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Not Started</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Follow Up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded relative">
                <div className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full"></div>
              </div>
              <span className="text-sm">Multiple Events</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
