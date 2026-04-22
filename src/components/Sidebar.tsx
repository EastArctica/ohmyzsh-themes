import { useEffect, useRef } from 'react';
import type { OverviewMap, Theme } from '../types';
import { FilterBar, type Filters } from './FilterBar';
import { ThemeRow } from './ThemeRow';

interface Props {
  themes: Theme[];
  overview: OverviewMap;
  selected: string | null;
  favorites: Set<string>;
  filters: Filters;
  favsOnly: boolean;
  availableFeatures: string[];
  onSelect: (name: string) => void;
  onToggleFav: (name: string) => void;
  onFiltersChange: (f: Filters) => void;
  onFavsOnly: (v: boolean) => void;
}

export function Sidebar({ themes, overview, selected, favorites, filters, favsOnly, availableFeatures, onSelect, onToggleFav, onFiltersChange, onFavsOnly }: Props) {
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-surface flex flex-col overflow-hidden">
      <FilterBar filters={filters} favsOnly={favsOnly} onChange={onFiltersChange} onFavsOnly={onFavsOnly} availableFeatures={availableFeatures} />
      <div className="overflow-y-auto flex-1">
        {themes.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted text-sm">
            No themes found
          </div>
        ) : (
          themes.map(theme => (
            <ThemeRow
              key={theme.name}
              theme={theme}
              overview={overview[theme.name]}
              isActive={theme.name === selected}
              isFav={favorites.has(theme.name)}
              onSelect={() => onSelect(theme.name)}
              onToggleFav={() => onToggleFav(theme.name)}
              innerRef={theme.name === selected ? el => { activeRef.current = el; } : undefined}
            />
          ))
        )}
      </div>
    </aside>
  );
}
