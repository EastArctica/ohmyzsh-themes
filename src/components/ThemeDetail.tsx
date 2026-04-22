import { useCallback, useState } from 'react';
import { FEAT_COLOR, FEAT_LABEL } from '../lib/constants';
import type { OverviewMap, Theme } from '../types';
import { TerminalWindow } from './TerminalWindow';

interface Props {
  theme: Theme | undefined;
  overview: OverviewMap;
  isFav: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleFav: () => void;
}

function renderDescription(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-accent hover:underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="bg-surface2 px-1 rounded font-mono text-[0.85em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/^> /gm, '')
    .replace(/^- /gm, '• ')
    .replace(/\n/g, '<br>');
}

function MetaRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-muted mb-0.5">{label}</div>
      {value
        ? <span className="text-green text-xs font-semibold">✓ Yes</span>
        : <span className="text-muted text-xs">— No</span>}
    </div>
  );
}

export function ThemeDetail({ theme, overview, isFav, canPrev, canNext, onPrev, onNext, onToggleFav }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!theme) return;
    navigator.clipboard?.writeText(`ZSH_THEME="${theme.name}"`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [theme]);

  if (!theme) {
    return (
      <main className="flex-1 flex items-center justify-center text-muted text-sm">
        Select a theme from the sidebar
      </main>
    );
  }

  const info = overview[theme.name];

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-bg">

      {/* ── Sub-header: nav left · install center · fav right ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-surface flex-shrink-0">

        {/* prev / next */}
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className="px-2.5 py-1 rounded border border-border bg-surface2 text-txt text-xs
                       hover:border-accent hover:text-accent transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="px-2.5 py-1 rounded border border-border bg-surface2 text-txt text-xs
                       hover:border-accent hover:text-accent transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* install command — centred */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 bg-bg border border-border rounded-md px-3 py-1.5">
            <span className="text-muted text-[10px] font-mono hidden sm:inline">~/.zshrc</span>
            <code className="font-mono text-green text-xs whitespace-nowrap">
              ZSH_THEME=&quot;{theme.name}&quot;
            </code>
            <button
              onClick={handleCopy}
              className={[
                'text-[10px] px-2 py-0.5 rounded border transition-colors flex-shrink-0',
                copied
                  ? 'border-green text-green'
                  : 'border-border text-muted hover:border-accent hover:text-accent',
              ].join(' ')}
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* fav */}
        <button
          onClick={onToggleFav}
          className={[
            'px-2.5 py-1 rounded border text-xs flex items-center gap-1 transition-colors flex-shrink-0',
            isFav
              ? 'border-fav text-fav bg-fav/10'
              : 'border-border text-muted bg-surface2 hover:border-fav hover:text-fav',
          ].join(' ')}
        >
          {isFav ? '♥' : '♡'} {isFav ? 'Favorited' : 'Favorite'}
        </button>
      </div>

      {/* ── Body: terminal left · metadata right ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* left — terminal image + optional description */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-w-0">
          <TerminalWindow
            imageUrl={theme.imageUrl}
            altText={`${theme.name} theme screenshot`}
          />
          {theme.description && (
            <div
              className="bg-surface border border-border rounded-lg px-4 py-3 text-muted text-[12px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderDescription(theme.description) }}
            />
          )}
        </div>

        {/* right — metadata panel */}
        <aside className="w-44 flex-shrink-0 border-l border-border bg-surface overflow-y-auto p-3 flex flex-col gap-4">

          {info ? (
            <>
              {/* boolean indicators */}
              <div className="flex flex-col gap-2.5">
                <MetaRow label="Username"    value={info.username} />
                <MetaRow label="Hostname"    value={info.hostname} />
                <MetaRow label="Time / Date" value={info.timedate} />
                <MetaRow label="Last Failure" value={info.lastFailure} />
              </div>

              {/* pwd style */}
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted mb-1">PWD Style</div>
                <span className="text-txt text-[11px] leading-snug">{info.pwdStyle || '—'}</span>
              </div>

              {/* features */}
              {info.features.length > 0 && (
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-muted mb-1.5">Features</div>
                  <div className="flex flex-col gap-1">
                    {info.features.map(f => {
                      const color = FEAT_COLOR[f];
                      const label = FEAT_LABEL[f] ?? f;
                      return (
                        <span
                          key={f}
                          className="px-2 py-0.5 rounded text-[10px] border self-start"
                          style={
                            color
                              ? { borderColor: color + '55', color, background: color + '15' }
                              : { borderColor: '#30363d', color: '#8b949e' }
                          }
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <span className="text-muted text-[11px]">No metadata available</span>
          )}

        </aside>
      </div>

    </main>
  );
}
