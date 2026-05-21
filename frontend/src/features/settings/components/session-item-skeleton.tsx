import { Skeleton } from '@heroui/react';

interface SessionItemSkeletonProps {
  isEven: boolean;
}

export const SessionItemSkeleton = ({ isEven }: SessionItemSkeletonProps) => {
  return (
    <div
      className={`flex items-center gap-2 h-10 md:h-9 rounded-2xl px-4 ${isEven ? 'bg-surface-secondary/50' : 'bg-surface'}`}
    >
      <Skeleton className="size-4 -ml-0.5" />
      <Skeleton className="h-2.5 w-7/10" />
    </div>
  );
};
