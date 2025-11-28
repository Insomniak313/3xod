import { FormEvent, useState } from 'react';
import { Button } from './ui/button.js';
import { Input } from './ui/input.js';
import { Sparkles } from 'lucide-react';

interface AskBarProps {
  placeholder?: string;
  isLoading?: boolean;
  onSubmit: (question: string) => void;
}

export const AskBar = ({ placeholder, isLoading = false, onSubmit }: AskBarProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/70 p-4 shadow-lg shadow-slate-200/60 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl bg-slate-900/90 p-3 text-white sm:flex">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder ?? 'Décris ton envie, on s’occupe du reste'}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="hidden sm:inline-flex">
          {isLoading ? 'Recherche…' : 'Lancer' }
        </Button>
      </div>
      <Button type="submit" disabled={isLoading} className="sm:hidden">
        {isLoading ? 'Recherche…' : 'Lancer'}
      </Button>
    </form>
  );
};
