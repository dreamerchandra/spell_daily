import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

// Types
export interface TabItem {
  id: string;
  label: string;
  link: string; // Navigation path
  icon?: ReactNode;
  children?: ReactNode;
}

interface TabContextType {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

// Context
const TabContext = createContext<TabContextType | undefined>(undefined);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('Tab components must be used within a TabWrapper');
  }
  return context;
};

// TabWrapper Component
interface TabWrapperProps {
  children: ReactNode;
  defaultTab?: string;
  className?: string;
}

export const TabWrapper: React.FC<TabWrapperProps> = ({
  children,
  defaultTab,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`flex h-full ${className}`}>{children}</div>
    </TabContext.Provider>
  );
};

// Tab Component
interface TabProps {
  tab: TabItem;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ tab, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab, setActiveTab } = useTabContext();

  // Check if current path matches the tab link
  const isActive = location.pathname === tab.link || activeTab === tab.id;

  const handleClick = () => {
    setActiveTab(tab.id);
    navigate(tab.link);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-3 w-full px-4 py-3 text-left transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
        ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
        }
        ${className}
      `}
    >
      {tab.icon && (
        <span
          className={`
            flex-shrink-0 w-5 h-5
            ${isActive ? 'text-blue-500' : 'text-gray-500'}
          `}
        >
          {tab.icon}
        </span>
      )}
      <span className="font-medium truncate">{tab.label}</span>
    </button>
  );
};

// TabList Component (for the scrollable sidebar)
interface TabListProps {
  children: ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        overflow-y-auto flex-shrink-0
        ${className}
      `}
    >
      <div className="py-2">{children}</div>
    </div>
  );
};

// TabContent Component
interface TabContentProps {
  children: ReactNode;
  className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900
        ${className}
      `}
    >
      <div className="p-6">{children}</div>
    </div>
  );
};

// ConditionalTabContent - shows content only when tab is active
interface ConditionalTabContentProps {
  tabId: string;
  children: ReactNode;
}

export const ConditionalTabContent: React.FC<ConditionalTabContentProps> = ({
  tabId,
  children,
}) => {
  const { activeTab } = useTabContext();

  if (activeTab !== tabId) {
    return null;
  }

  return <>{children}</>;
};

// Note: To get the active tab, use const { activeTab } = useTabContext() within your component

// Example usage component
export const ExampleTabs: React.FC = () => {
  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      link: '/dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'users',
      label: 'Users',
      link: '/users',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      link: '/settings',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <TabWrapper defaultTab="dashboard" className="h-screen">
      <TabList>
        {tabs.map(tab => (
          <Tab key={tab.id} tab={tab} />
        ))}
      </TabList>

      <TabContent>
        <ConditionalTabContent tabId="dashboard">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Dashboard content goes here...</p>
        </ConditionalTabContent>

        <ConditionalTabContent tabId="users">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <p>Users management content goes here...</p>
        </ConditionalTabContent>

        <ConditionalTabContent tabId="settings">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p>Settings content goes here...</p>
        </ConditionalTabContent>
      </TabContent>
    </TabWrapper>
  );
};
