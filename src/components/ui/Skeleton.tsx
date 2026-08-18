import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        {
          'rounded-full': variant === 'circular',
          'rounded-md': variant === 'rectangular' || variant === 'default',
          'h-4 w-full': variant === 'text',
          'h-12 w-12': variant === 'circular',
        },
        className
      )}
      {...props}
    />
  );
}

// Card skeleton for stories, quizzes, store items
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="h-48 w-full" variant="rectangular" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
      </div>
    </div>
  );
}

// Table skeleton for admin panels
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b space-y-3">
        <Skeleton className="h-6 w-1/4" variant="text" />
        <Skeleton className="h-10 w-full" variant="rectangular" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 grid grid-cols-4 gap-4">
            <Skeleton className="h-5 w-full" variant="text" />
            <Skeleton className="h-5 w-full" variant="text" />
            <Skeleton className="h-5 w-full" variant="text" />
            <Skeleton className="h-5 w-full" variant="text" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Stats skeleton for dashboards
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
          <Skeleton className="h-8 w-1/2" variant="text" />
          <Skeleton className="h-12 w-3/4" variant="rectangular" />
        </div>
      ))}
    </div>
  );
}

// Child profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400" />
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-4 -mt-12">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-white" variant="circular" />
            <div className="flex-1 space-y-2 pt-8">
              <Skeleton className="h-6 w-1/3" variant="text" />
              <Skeleton className="h-4 w-1/4" variant="text" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" variant="rectangular" />
        <Skeleton className="h-24 w-full" variant="rectangular" />
        <Skeleton className="h-24 w-full" variant="rectangular" />
      </div>
    </div>
  );
}