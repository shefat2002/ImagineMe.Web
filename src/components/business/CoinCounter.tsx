import { HTMLAttributes } from 'react';

export interface CoinCounterProps extends HTMLAttributes<HTMLDivElement> {
  coins: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoinCounter({ coins, size = 'md', className = '', ...props }: CoinCounterProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
        <span className="text-yellow-900 font-bold">$</span>
      </div>
      <span className={`${sizes[size]} font-semibold text-gray-800`}>{coins}</span>
    </div>
  );
}