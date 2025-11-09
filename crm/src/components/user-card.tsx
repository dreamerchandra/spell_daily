import type { FC } from 'react';
import type { User } from '../type/user';

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const UserCard: FC<{
  user: User;
  handleItemClick: () => void;
}> = ({ user, handleItemClick }) => {
  return (
    <div
      className="flex items-center justify-between py-3 hover:bg-app-hover rounded-lg px-2 cursor-pointer transition-colors"
      onClick={handleItemClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-4">
          <span className="font-bold text-app-primary">
            {user.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-app-primary">
            {user.name} ({user.parentName})
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-app-secondary">{user.status}</div>
            <div className="text-sm text-app-secondary">
              {getRelativeTime(user.lastCompletedDate)} • {user.userAdmin}
            </div>
          </div>
        </div>
      </div>
      <svg
        className="w-5 h-5 text-app-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
};
