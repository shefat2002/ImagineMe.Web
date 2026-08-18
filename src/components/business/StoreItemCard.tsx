import { memo } from 'react';
import Image from 'next/image';
import { CardProps } from '../ui/Card';

export interface StoreItemCardProps extends Omit<CardProps, 'children'> {
  item: {
    id: string;
    name: string;
    priceInCoins: number;
    assetUrl: string;
  };
  owned?: boolean;
  onClick?: () => void;
}

const StoreItemCard = memo(function StoreItemCard({ item, owned = false, onClick, className = '', ...props }: StoreItemCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${owned ? 'opacity-60' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="relative">
        <Image
          src={item.assetUrl}
          alt={item.name}
          width={400}
          height={160}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        {owned && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            Owned
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">{item.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <span className="text-yellow-900 text-xs font-bold">$</span>
            </div>
            <span className="font-bold text-gray-800">{item.priceInCoins}</span>
          </div>
          {!owned && (
            <span className="text-sm text-blue-600 font-medium hover:text-blue-700">Request</span>
          )}
        </div>
      </div>
    </div>
  );
});

export default StoreItemCard;