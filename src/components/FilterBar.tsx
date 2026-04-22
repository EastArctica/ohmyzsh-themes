import { useState } from 'react';
import { FEAT_COLOR, FEAT_LABEL } from '../lib/constants';

export type TriState = 0 | 1 | -1;

export interface Filters {
  username: TriState;
  hostname: TriState;
  timedate: TriState;
  lastFailure: TriState;
  features: Record<string, TriState>;
}

export const DEFAULT_FILTERS: Filters = {
  username: 0, hostname: 0, timedate: 0, lastFailure: 0, features: {},
};

export function isFiltering(f: Filters, favsOnly: boolean): boolean {
  return favsOnly || !!(f.username || f.hostname || f.timedate || f.lastFailure ||
    Object.values(f.features).some(v => v !== 0));
}

function cycle(v: TriState): TriState {
  return v === 0 ? 1 : v === 1 ? -1 : 0;
}

const BOOL_FIELDS: { key: keyof Omit<Filters, 'features'>; label: string }[] = [
  { key: 'username',    label: 'user' },
  { key: 'hostname',    label: 'host' },
  { key: 'timedate',    label: 'time' },
  { key: 'lastFailure', label: 'fail' },
];

const base = 'text-[10px] px-1.5 py-0.5 rounded border transition-all cursor-pointer select-none';
const neutral = `${base} border-border text-muted hover:border-txt/30 hover:text-txt/60`;
const activeHover = 'hover:opacity-60';

function BoolChip({ label, value, onClick }: { label: string; value: TriState; onClick: () => void }) {
  const cls = value === 1
    ? `${base} border-green/50 text-green bg-green/10 ${activeHover}`
    : value === -1
    ? `${base} border-fav/50 text-fav bg-fav/10 ${activeHover}`
    : neutral;
  return <button className={cls} onClick={onClick}>{value === 1 ? '+' : value === -1 ? '−' : ''}{label}</button>;
}

function FavsChip({ value, onClick }: { value: boolean; onClick: () => void }) {
  const cls = value
    ? `${base} border-fav/60 text-fav bg-fav/10 ${activeHover}`
    : neutral;
  return <button className={cls} onClick={onClick}>♥ favs</button>;
}

function FeatChip({ feat, value, onClick }: { feat: string; value: TriState; onClick: () => void }) {
  const label = FEAT_LABEL[feat] ?? feat;
  const color = FEAT_COLOR[feat];

  if (value === -1) {
    return <button className={`${base} border-fav/50 text-fav bg-fav/10 ${activeHover}`} onClick={onClick}>−{label}</button>;
  }
  if (value === 1) {
    const style = color
      ? { borderColor: color + '88', color, background: color + '18' }
      : { borderColor: '#3fb95088', color: '#3fb950', background: '#3fb95018' };
    return <button className={`${base} ${activeHover}`} style={style} onClick={onClick}>+{label}</button>;
  }
  return <button className={neutral} onClick={onClick}>{label}</button>;
}

interface Props {
  filters: Filters;
  favsOnly: boolean;
  onChange: (f: Filters) => void;
  onFavsOnly: (v: boolean) => void;
  availableFeatures: string[];
}

export function FilterBar({ filters, favsOnly, onChange, onFavsOnly, availableFeatures }: Props) {
  const [open, setOpen] = useState(false);
  const active = isFiltering(filters, favsOnly);

  return (
    <div className="border-b border-border flex-shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] text-muted hover:text-txt transition-colors"
      >
        <span className="flex items-center gap-1.5">
          Filters
          {active && <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />}
        </span>
        <span className="text-[9px]">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="px-2 pb-2 flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1">
            <FavsChip value={favsOnly} onClick={() => onFavsOnly(!favsOnly)} />
            {BOOL_FIELDS.map(({ key, label }) => (
              <BoolChip
                key={key}
                label={label}
                value={filters[key]}
                onClick={() => onChange({ ...filters, [key]: cycle(filters[key]) })}
              />
            ))}
          </div>

          {availableFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {availableFeatures.map(feat => (
                <FeatChip
                  key={feat}
                  feat={feat}
                  value={filters.features[feat] ?? 0}
                  onClick={() => onChange({
                    ...filters,
                    features: { ...filters.features, [feat]: cycle(filters.features[feat] ?? 0) },
                  })}
                />
              ))}
            </div>
          )}

          {active && (
            <button
              onClick={() => { onChange(DEFAULT_FILTERS); onFavsOnly(false); }}
              className="self-start text-[10px] text-muted hover:text-txt transition-colors underline underline-offset-2"
            >
              clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
