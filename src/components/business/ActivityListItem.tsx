import { HTMLAttributes } from 'react';

export interface ActivityListItemProps extends HTMLAttributes<HTMLDivElement> {
  activity: {
    activityType: number;
    storyId?: string | null;
    quizId?: string | null;
    coinsEarned: number;
    completedAt: string;
  };
}

export default function ActivityListItem({ activity, className = '', ...props }: ActivityListItemProps) {
  const getActivityType = (type: number) => {
    switch (type) {
      case 0: return { icon: '📖', label: 'Story' };
      case 1: return { icon: '🧠', label: 'Quiz' };
      case 2: return { icon: '🎮', label: 'Game' };
      case 3: return { icon: '🎁', label: 'Daily Login' };
      default: return { icon: '⭐', label: 'Activity' };
    }
  };

  const { icon, label } = getActivityType(activity.activityType);
  const date = new Date(activity.completedAt).toLocaleDateString();

  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${className}`} {...props}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-green-600 font-semibold">
        <span>+{activity.coinsEarned}</span>
        <span className="text-yellow-500">💰</span>
      </div>
    </div>
  );
}