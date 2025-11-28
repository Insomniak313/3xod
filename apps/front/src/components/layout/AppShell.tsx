import { ReactNode } from 'react';
import { cn } from '../../utils/cn.js';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
    <div className={cn('mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:px-8')}>
      {children}
    </div>
  </div>
);
