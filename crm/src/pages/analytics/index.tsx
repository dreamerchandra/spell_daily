import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAnalytics } from './useAnalytics.ts';
import { Header } from '../../components/Header';
import { Calendar } from '../../components/Calendar';
import Href from '../../components/href.tsx';
import { WhatsApp } from '@mui/icons-material';

const newMessageTemplate = ({
  studentName,
  link,
}: {
  studentName?: string | null;
  link: string;
}) => `Day 1 spelling task 

${link}


Click start game and proceed. 
Please notify me after completion. 


🔥 Enjoy ${studentName ? studentName : ''}
`;

const getLink = (testCode: string) =>
  `https://app.spelldaily.com/?code=${testCode}`;

const generateWhatsAppLink = (phoneNumber: string, message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/+91${phoneNumber}?text=${encodedMessage}`;
};

export default function Analytics() {
  const { testCode } = useParams<{ testCode: string }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('isNew') === 'true';
  const [newMessage, setNewMessage] = useState('');

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

  useEffect(() => {
    if (!analyticsData) return;
    setNewMessage(
      newMessageTemplate({
        studentName: analyticsData?.parent?.name,
        link: getLink(testCode || ''),
      })
    );
  }, [analyticsData, testCode]);

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
        {isNew && (
          <div className="flex gap-1 flex-col">
            <div className="bg-green-100 border border-green-200 text-green-800 rounded">
              🎉 New test code created successfully!
            </div>
            <textarea
              className="mt-2 w-full p-2 border border-gray-300 rounded bg-gray-50 text-black h-auto field-sizing-content"
              value={newMessage}
              onChange={e => {
                setNewMessage(e.target.value);
              }}
            />
            <Href
              variant="secondary"
              href={generateWhatsAppLink(
                analyticsData?.parent?.phoneNumber || '',
                newMessage
              )}
              icon={<WhatsApp />}
            >
              Send WhatsApp Message
            </Href>
          </div>
        )}
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
