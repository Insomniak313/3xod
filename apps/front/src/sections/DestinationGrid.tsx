import { DestinationCard as DestinationCardType } from '@3xod/shared';
import { DestinationCard } from '../components/cards/DestinationCard.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { memo } from 'react';

interface DestinationGridProps {
  cards: DestinationCardType[];
  isLoading: boolean;
  lastQuestion?: string;
}

export const DestinationGrid = memo(({ cards, isLoading, lastQuestion }: DestinationGridProps) => {
  if (isLoading && cards.length === 0) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-10 text-center text-slate-500">
        {lastQuestion
          ? 'Patience, nous affinons encore les recommandations…'
          : 'Commence par une question pour découvrir des idées.'}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <DestinationCard key={card.id} card={card} />
      ))}
    </div>
  );
});

DestinationGrid.displayName = 'DestinationGrid';
