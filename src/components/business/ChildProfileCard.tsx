import { HTMLAttributes } from 'react';
import { Avatar } from '../ui';

export interface ChildProfileCardProps extends HTMLAttributes<HTMLDivElement> {
  child: {
    childId: string;
    username: string;
    avatarState: string | null;
    coins: number;
    currentStreak: number;
    lastActivityAt: string | null;
  };
  onClick?: () => void;
}

export default function ChildProfileCard({ child, onClick, className = '', ...props }: ChildProfileCardProps) {
  const getLastActivity = (date: string | null) => {
    if (!date) return 'Never active';
    const activityDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Active today';
    if (diffDays === 1) return 'Active yesterday';
    if (diffDays < 7) return `Active ${diffDays} days ago`;
    return `Active ${diffDays} days ago`;
  };

  const avatar = child.avatarState || child.username.charAt(0).toUpperCase();

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar size="lg" fallback={avatar} />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{child.username}</h3>
          <p className="text-sm text-gray-500">{getLastActivity(child.lastActivityAt)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-yellow-500">💰</span>
            <span className="font-bold text-gray-900">{child.coins}</span>
          </div>
          <p className="text-xs text-gray-600">Coins</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-orange-500">🔥</span>
            <span className="font-bold text-gray-900">{child.currentStreak}</span>
          </div>
          <p className="text-xs text-gray-600">Day Streak</p>
        </div>
      </div>
    </div>
  );
}