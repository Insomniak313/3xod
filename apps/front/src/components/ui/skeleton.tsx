import { cn } from '../../utils/cn.js';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-2xl bg-slate-200/80', className)} />
);
