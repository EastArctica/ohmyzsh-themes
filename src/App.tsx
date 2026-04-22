import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_FILTERS, type Filters } from './components/FilterBar';
import { Sidebar } from './components/Sidebar';
import { ThemeDetail } from './components/ThemeDetail';
import { PIP_PRIORITY } from './lib/constants';
import { useFavorites } from './hooks/useFavorites';
import { useThemes } from './hooks/useThemes';

function SearchIcon() {
  return (
    <svg
      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function App() {
  const { themes, overview, loading, error } = useThemes();
  const { favorites, toggle: toggleFav } = useFavorites();

  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [favsOnly, setFavsOnly] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const searchRef = useRef<HTMLInputElement>(null);

  // Pick initial theme once data loads
  useEffect(() => {
    if (themes.length && !selected) {
      const initial = themes.find(t => t.name === 'robbyrussell') ?? themes[0];
      setSelected(initial.name);
    }
  }, [themes, selected]);

  const availableFeatures = useMemo(() => {
    const seen = new Set<string>();
    Object.values(overview).forEach(info => info.features.forEach(f => seen.add(f)));
    return [
      ...PIP_PRIORITY.filter(f => seen.has(f)),
      ...[...seen].filter(f => !PIP_PRIORITY.includes(f)).sort(),
    ];
  }, [overview]);

  const filtered = useMemo(() => {
    let list = themes;
    if (favsOnly) list = list.filter(t => favorites.has(t.name));
    if (search) list = list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    const { username, hostname, timedate, lastFailure, features: featFilters } = filters;
    const activeFeat = Object.entries(featFilters).filter(([, v]) => v !== 0);
    if (username || hostname || timedate || lastFailure || activeFeat.length) {
      list = list.filter(t => {
        const info = overview[t.name];
        if (!info) return false;
        if (username === 1 && !info.username) return false;
        if (username === -1 && info.username) return false;
        if (hostname === 1 && !info.hostname) return false;
        if (hostname === -1 && info.hostname) return false;
        if (timedate === 1 && !info.timedate) return false;
        if (timedate === -1 && info.timedate) return false;
        if (lastFailure === 1 && !info.lastFailure) return false;
        if (lastFailure === -1 && info.lastFailure) return false;
        for (const [feat, state] of activeFeat) {
          const has = info.features.includes(feat);
          if (state === 1 && !has) return false;
          if (state === -1 && has) return false;
        }
        return true;
      });
    }

    return list;
  }, [themes, overview, favorites, favsOnly, search, filters]);

  const selectedTheme = useMemo(
    () => themes.find(t => t.name === selected),
    [themes, selected],
  );

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setSelected(prev => {
        const idx = filtered.findIndex(t => t.name === prev);
        return filtered[idx + dir]?.name ?? prev;
      });
    },
    [filtered],
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    const next = themes.filter(t => {
      if (favsOnly && !favorites.has(t.name)) return false;
      return t.name.toLowerCase().includes(val.toLowerCase());
    });
    setSelected(prev => (next.find(t => t.name === prev) ? prev : (next[0]?.name ?? prev)));
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === 'INPUT') return;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); navigate(1); }
      else if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); navigate(-1); }
      else if (e.key === 'f' || e.key === 'F') { if (selected) toggleFav(selected); }
      else if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, selected, toggleFav]);

  const filteredIdx = filtered.findIndex(t => t.name === selected);

  return (
    <div className="h-full flex flex-col bg-bg text-txt">

      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="flex items-center gap-2.5 px-4 h-13 flex-shrink-0 bg-surface border-b border-border">
        <span className="font-mono text-sm font-bold text-green whitespace-nowrap flex-shrink-0 select-none">
          %&nbsp;<span className="text-accent">oh-my-zsh</span>&nbsp;themes
        </span>

        <div className="relative flex-1 max-w-[220px]">
          <SearchIcon />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search…"
            autoComplete="off"
            spellCheck={false}
            className="w-full pl-8 pr-3 py-1.5 bg-bg border border-border rounded-md text-[13px]
                       text-txt placeholder:text-muted outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-muted text-[12px] whitespace-nowrap tabular-nums">
            {loading ? 'Loading…' : `${filtered.length} themes`}
          </span>

          <span className="hidden sm:flex items-center gap-1 text-muted text-[11px] whitespace-nowrap select-none">
            <kbd className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[10px] font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[10px] font-mono">↓</kbd>
            <span>nav</span>
            <kbd className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[10px] font-mono ml-1">F</kbd>
            <span>fav</span>
            <kbd className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[10px] font-mono ml-1">/</kbd>
            <span>search</span>
          </span>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────── */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted text-sm">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          Fetching themes from GitHub…
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-fav text-sm">{error}</div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            themes={filtered}
            overview={overview}
            selected={selected}
            favorites={favorites}
            filters={filters}
            favsOnly={favsOnly}
            availableFeatures={availableFeatures}
            onSelect={setSelected}
            onToggleFav={toggleFav}
            onFiltersChange={setFilters}
            onFavsOnly={setFavsOnly}
          />
          <ThemeDetail
            theme={selectedTheme}
            overview={overview}
            isFav={selected ? favorites.has(selected) : false}
            canPrev={filteredIdx > 0}
            canNext={filteredIdx < filtered.length - 1}
            onPrev={() => navigate(-1)}
            onNext={() => navigate(1)}
            onToggleFav={() => selected && toggleFav(selected)}
          />
        </div>
      )}

    </div>
  );
}
