import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
    </div>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900/40 rounded-xl overflow-hidden border border-neutral-200/70 dark:border-neutral-800/70">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};
