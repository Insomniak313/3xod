import { lazy, Suspense } from 'react';
import { AppShell } from './components/layout/AppShell.js';
import { AskSection } from './sections/AskSection.js';
import { useConversationFlow } from './features/conversation/useConversationFlow.js';

const DestinationGrid = lazy(async () => ({
  default: (await import('./sections/DestinationGrid.js')).DestinationGrid,
}));

export const App = () => {
  const { cards, isLoading, askQuestion, error, lastQuestion } = useConversationFlow();

  return (
    <AppShell>
      <AskSection onAsk={askQuestion} isLoading={isLoading} error={error} />
      <Suspense fallback={<div className="text-center text-slate-500">Préparation des cartes…</div>}>
        <DestinationGrid cards={cards} isLoading={isLoading} lastQuestion={lastQuestion} />
      </Suspense>
    </AppShell>
  );
};
