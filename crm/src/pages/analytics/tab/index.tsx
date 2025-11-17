import { Route, Routes, useParams, useSearchParams } from 'react-router-dom';
import { type TabItem, TabList, Tab } from '../../../components/tabs';
import { ShareMessageTab } from './share-message-tab';
import { AnalyticsView } from './analytics-view';
import { FollowUpTab } from '../../code-generator/tab/follow-up-tab';

const Loading = () => {
  return <div>Loading...</div>;
};

export const AnalyticsTab = ({ parentId }: { parentId: string }) => {
  const { testCode } = useParams<{ testCode: string }>();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('isNew') === 'true';
  const baseUrl = `/analytics/${testCode}`;
  const tabs: TabItem[] = [
    {
      id: 'Message',
      label: 'Message',
      link: `/message`,
      children: <ShareMessageTab testCode={testCode!} isNew={isNew} />,
      baseUrl,
    },
    {
      id: 'Calendar',
      label: 'Calendar',
      link: '',
      children: <AnalyticsView testCode={testCode!} />,
      baseUrl,
    },
    {
      id: 'Follow Up',
      label: 'Follow Up',
      link: `/follow-up`,
      children: <FollowUpTab parentId={parentId!} testCode={testCode!} />,
      baseUrl,
    },
  ];

  if (!testCode) {
    return <Loading />;
  }

  if (!parentId) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-full">
      <TabList>
        {tabs.map(tab => (
          <Tab key={tab.id} tab={tab} />
        ))}
      </TabList>

      <div className="flex-1 overflow-hidden">
        <Routes>
          {tabs.map(tab => (
            <Route key={tab.id} path={tab.link} element={tab.children} />
          ))}
        </Routes>
      </div>
    </div>
  );
};
