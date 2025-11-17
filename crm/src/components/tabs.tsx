import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

// Types
export interface TabItem {
  id: string;
  label: string;
  link: string; // Navigation path
  baseUrl: string;
  icon?: ReactNode;
  children?: ReactNode;
}
// Tab Component
interface TabProps {
  tab: TabItem;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const Tab: React.FC<TabProps> = ({
  tab,
  className = '',
  layout = 'horizontal',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current path matches the tab link
  const isActive = location.pathname.endsWith(tab.link);

  const handleClick = () => {
    navigate(`${tab.baseUrl}${tab.link}`);
  };

  // Horizontal layout styles
  if (layout === 'horizontal') {
    return (
      <div className="flex-shrink-0">
        <button
          onClick={handleClick}
          className={`
            flex items-center justify-center gap-2 min-w-max px-6 py-3 text-center
            transition-all duration-200 border-b-2 whitespace-nowrap
            hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
            ${
              isActive
                ? 'border-blue-500 text-blue-700 '
                : 'border-transparent text-blue-200 hover:text-gray-900 hover:border-blue-200'
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
          <span className="font-medium">{tab.label}</span>
        </button>
      </div>
    );
  }

  // Vertical layout styles (original)
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

// TabList Component (supports both horizontal and vertical layouts)
interface TabListProps {
  children: ReactNode;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const TabList: React.FC<TabListProps> = ({
  children,
  className = '',
  layout = 'horizontal',
}) => {
  if (layout === 'horizontal') {
    return (
      <div className={`border-b border-gray-200 ${className}`}>
        <div
          className="flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Vertical layout (original)
  return (
    <div
      className={`
        w-64  dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        overflow-y-auto flex-shrink-0
        ${className}
      `}
    >
      <div className="py-2">{children}</div>
    </div>
  );
};

// TabContent Component (handles routing with Outlet)
interface TabContentProps {
  children?: ReactNode;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export const TabContent: React.FC<TabContentProps> = ({
  children,
  className = '',
  layout = 'horizontal',
}) => {
  return (
    <div
      className={`
        flex-1 overflow-y-auto
        ${layout === 'horizontal' ? 'bg-app' : 'bg-gray-50 dark:bg-gray-900'}
        ${className}
      `}
    >
      <div className={layout === 'horizontal' ? '' : 'p-6'}>
        {children ? children : <Outlet />}
      </div>
    </div>
  );
};
