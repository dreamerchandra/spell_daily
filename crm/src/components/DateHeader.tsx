import React from 'react';

interface DateHeaderProps {
  date: string;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const messageDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-4">
      <div className="px-3 py-1 bg-app-hover rounded-full">
        <span className="text-xs font-medium text-app-secondary">
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
};
