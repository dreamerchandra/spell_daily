import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Calendar } from '../../components/Calendar';
import { Header } from '../../components/Header';
import { ShareWelcomeMessage } from './share-message';
import { useAnalytics } from './useAnalytics.ts';

export default function Analytics() {
  const { testCode } = useParams<{ testCode: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('isNew') === 'true';

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

  const calendarEvents = analyticsData
    ? {
        partial: analyticsData.partialCompletion,
        notStarted: analyticsData.notStarted,
        followUp: analyticsData.followUpDates,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-app text-app-primary">
      <Header>
        <div>
          <h1 className="text-xl font-bold text-app-primary">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-400">
            Test Code:{' '}
            <span className="text-app-primary font-semibold">{testCode}</span>
          </p>
        </div>
      </Header>

      <div className="mx-auto max-w-4xl p-6 flex gap-6 flex-col">
        {analyticsData ? (
          <ShareWelcomeMessage
            currentMonth={currentDate.getMonth()}
            dailyUsage={analyticsData}
            isNew={isNew}
            testCode={testCode!}
          />
        ) : null}
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
    </div>
  );
}
