import { Route, Routes } from 'react-router-dom';
import { Tab, TabList, type TabItem } from '../../components/tabs';
import { ReportTab } from './tab/report-tab';
import AllUsersTab from './tab/all-users-tab';
import { useTelegram } from '../../hooks/useTelegram';

export const HomeTab = () => {
  const { initData } = useTelegram();
  const tabs: TabItem[] = [
    {
      id: 'Report',
      label: 'Report',
      link: '',
      children: <ReportTab />,
      baseUrl: '/',
    },
    {
      id: 'All Users',
      label: 'All Users',
      link: 'all-users',
      children: <AllUsersTab apiKey={initData} />,
      baseUrl: '/',
    },
  ];

  return (
    <>
      <TabList>
        {tabs.map(tab => (
          <Tab key={tab.id} tab={tab} />
        ))}
      </TabList>

      {/* Tab content with our new TabContent component */}
      <Routes>
        {tabs.map(tab => (
          <Route key={tab.id} path={tab.link} element={tab.children} />
        ))}
      </Routes>
    </>
  );
};
