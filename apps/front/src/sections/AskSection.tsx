import { AskBar } from '../components/AskBar.js';
import { Badge } from '../components/ui/badge.js';
import { Button } from '../components/ui/button.js';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux.js';
import {
  PreferenceOption,
  selectPreferenceOptions,
  selectSelectedPreferences,
  togglePreference,
} from '../features/preferences/preferences.slice.js';

interface AskSectionProps {
  onAsk: (question: string) => void;
  isLoading: boolean;
  error?: string;
}

export const AskSection = ({ onAsk, isLoading, error }: AskSectionProps) => {
  const dispatch = useAppDispatch();
  const options = useAppSelector(selectPreferenceOptions);
  const selected = useAppSelector(selectSelectedPreferences);

  const isSelected = (option: PreferenceOption) =>
    selected.some((pref) => pref.id === option.id);

  return (
    <section className="mt-4 flex flex-col gap-6">
      <header className="flex flex-col gap-3 text-center md:text-left">
        <Badge tone="success" className="mx-auto md:mx-0">
          Nouveau • Ton concierge activités
        </Badge>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">
          Décris ton envie, 3xod imagine la suite.
        </h1>
        <p className="text-base text-slate-600 md:text-lg">
          Pose une question libre, sélectionne quelques préférences et laisse l’IA te proposer
          des destinations prêtes à réserver.
        </p>
      </header>

      <AskBar onSubmit={onAsk} isLoading={isLoading} />

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <Button
            key={option.id}
            type="button"
            variant="ghost"
            onClick={() => dispatch(togglePreference(option))}
            className={`border text-sm ${
              isSelected(option)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-200'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : (
        <p className="text-sm text-slate-500">
          Astuce: demande par exemple « week-end nature pour deux autour de 400€ ».
        </p>
      )}
    </section>
  );
};
