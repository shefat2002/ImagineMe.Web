import { memo } from 'react';
import Image from 'next/image';
import { CardProps } from '../ui/Card';

export interface StoryCardProps extends Omit<CardProps, 'children'> {
  story: {
    id: string;
    title: string;
    coverImageUrl: string;
    status: number;
  };
  onClick?: () => void;
}

const StoryCard = memo(function StoryCard({ story, onClick, className = '', ...props }: StoryCardProps) {
  const isPublished = story.status === 1;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="relative">
        <Image
          src={story.coverImageUrl}
          alt={story.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {!isPublished && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
            Draft
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{story.title}</h3>
        {isPublished && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📖 Read story</span>
            <span className="text-green-600 font-medium">+10 coins</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default StoryCard;