import { FEAT_COLOR, FEAT_LABEL, PIP_PRIORITY } from '../lib/constants';
import type { Theme, ThemeOverview } from '../types';

interface Props {
  theme: Theme;
  overview: ThemeOverview | undefined;
  isActive: boolean;
  isFav: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
  innerRef?: (el: HTMLDivElement | null) => void;
}

export function ThemeRow({ theme, overview, isActive, isFav, onSelect, onToggleFav, innerRef }: Props) {
  const feats = overview?.features ?? [];
  const pips = PIP_PRIORITY.filter(f => feats.includes(f)).slice(0, 5);

  return (
    <div
      ref={innerRef}
      onClick={onSelect}
      className={[
        'flex items-center gap-2.5 px-2.5 py-2 cursor-pointer border-b border-border/50 transition-colors group',
        isActive
          ? 'bg-accent/10 border-l-2 border-l-accent pl-2'
          : 'hover:bg-surface2',
      ].join(' ')}
    >
      {/* thumbnail */}
      <div className="w-[70px] h-[39px] flex-shrink-0 rounded overflow-hidden border border-border bg-surface2">
        <img
          src={theme.imageUrl}
          alt={theme.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={e => {
            (e.currentTarget.parentElement!).innerHTML =
              '<div style="font-size:9px;color:#8b949e;display:flex;align-items:center;justify-content:center;height:100%">no img</div>';
          }}
        />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className={[
          'font-mono text-[11.5px] font-semibold truncate',
          isActive ? 'text-accent' : 'text-txt',
        ].join(' ')}>
          {theme.name}
        </div>
        {pips.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {pips.map(f => (
              <span
                key={f}
                title={FEAT_LABEL[f] ?? f}
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: FEAT_COLOR[f] ?? '#666' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* fav button */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(); }}
        className={[
          'text-[13px] px-1 py-0.5 flex-shrink-0 transition-all hover:scale-125',
          isFav ? 'text-fav' : 'text-muted opacity-0 group-hover:opacity-100',
        ].join(' ')}
        aria-label={isFav ? 'Unfavorite' : 'Favorite'}
      >
        {isFav ? '♥' : '♡'}
      </button>
    </div>
  );
}
