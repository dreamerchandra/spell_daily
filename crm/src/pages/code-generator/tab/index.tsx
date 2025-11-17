import { Route, Routes, useParams } from 'react-router-dom';
import { type TabItem, TabList, Tab } from '../../../components/tabs';
import { TestCodeTab } from './test-code';
import { FollowUpTab } from './follow-up-tab';

export const ParentTab = () => {
  const { parentId } = useParams<{ parentId: string }>();
  const baseUrl = `/parent/${parentId}`;
  const tabs: TabItem[] = [
    {
      id: 'Students',
      label: 'Students',
      link: '',
      children: <TestCodeTab />,
      baseUrl,
    },
    {
      id: 'Follow Up',
      label: 'Follow Up',
      link: `/follow-up`,
      children: <FollowUpTab parentId={parentId!} />,
      baseUrl,
    },
  ];

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
