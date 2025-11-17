import { Calendar } from '../../../components/Calendar';
import { useState } from 'react';
import { useAnalytics } from '../useAnalytics.ts';

export const AnalyticsView = ({ testCode }: { testCode: string }) => {
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

  const calendarEvents = analyticsData
    ? {
        partial: analyticsData.partialCompletion,
        notStarted: analyticsData.notStarted,
        followUp: analyticsData.followUpDates,
      }
    : undefined;
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
  return (
    <div className="flex-1 overflow-y-auto h-full p-3">
      <Calendar
        currentDate={currentDate}
        onNavigateMonth={navigateMonth}
        canNavigatePrev={canNavigatePrev()}
        events={calendarEvents}
        startedDate={startedDate}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};
