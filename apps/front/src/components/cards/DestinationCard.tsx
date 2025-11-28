import { DestinationCard as DestinationCardType } from '@3xod/shared';
import { Card, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';
import { MapPin, Heart, ArrowRight } from 'lucide-react';

interface DestinationCardProps {
  card: DestinationCardType;
  onSelect?: (card: DestinationCardType) => void;
}

export const DestinationCard = ({ card, onSelect }: DestinationCardProps) => {
  const imageUrl = card.imageUrl.includes('?')
    ? `${card.imageUrl}&w=600&auto=format`
    : `${card.imageUrl}?w=600&auto=format`;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={card.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
          <MapPin size={14} /> {card.city}, {card.country}
        </div>
        <div className="absolute right-4 top-4">
          <Badge tone="success">{Math.round(card.suitabilityScore * 100)}% match</Badge>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">{card.name}</h3>
            <button
              type="button"
              className="rounded-full bg-white/80 p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
              aria-label="Ajouter aux favoris"
            >
              <Heart size={18} />
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">{card.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {card.tags.slice(0, 4).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Budget {card.budgetLevel}
          </div>
          <Button
            variant="ghost"
            onClick={() => onSelect?.(card)}
            className="gap-2 px-4 text-sm font-semibold"
          >
            Explorer <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
