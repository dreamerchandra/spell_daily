import { ShareWelcomeMessage } from '../share-message.tsx';
import { useAnalytics } from '../useAnalytics.ts';

export const ShareMessageTab = ({
  testCode,
  isNew,
}: {
  testCode: string;
  isNew: boolean;
}) => {
  const currentDate = new Date();
  const { data: analyticsData } = useAnalytics({
    testCode: testCode!,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  if (!analyticsData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex-1 overflow-y-auto h-full p-3">
      <ShareWelcomeMessage
        currentMonth={currentDate.getMonth()}
        dailyUsage={analyticsData}
        isNew={isNew}
        testCode={testCode!}
      />
    </div>
  );
};
