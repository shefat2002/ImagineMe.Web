import { HTMLAttributes } from 'react';

export interface StreakBadgeProps extends HTMLAttributes<HTMLDivElement> {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakBadge({ streak, size = 'md', className = '', ...props }: StreakBadgeProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getFireEmoji = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '⚡';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <span className={`${sizes[size]}`}>{getFireEmoji(streak)}</span>
      <span className={`${sizes[size]} font-bold text-gray-800`}>{streak} day streak</span>
    </div>
  );
}