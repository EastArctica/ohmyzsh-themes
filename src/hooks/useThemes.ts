import { useEffect, useState } from 'react';
import { OVERVIEW_URL, THEMES_URL } from '../lib/constants';
import { parseOverview, parseThemes } from '../lib/parse';
import type { OverviewMap, Theme } from '../types';

interface ThemesState {
  themes: Theme[];
  overview: OverviewMap;
  loading: boolean;
  error: string | null;
}

async function fetchMd(url: string, fallback?: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch {
    if (fallback) {
      try {
        const res = await fetch(fallback);
        if (res.ok) return res.text();
      } catch {}
    }
    return '';
  }
}

export function useThemes(): ThemesState {
  const [state, setState] = useState<ThemesState>({
    themes: [],
    overview: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchMd(THEMES_URL, './Themes.md'),
      fetchMd(OVERVIEW_URL, './Themes-Overview.md'),
    ]).then(([themesMd, overviewMd]) => {
      if (cancelled) return;
      const themes = parseThemes(themesMd);
      const overview = parseOverview(overviewMd);
      if (!themes.length) {
        setState({ themes: [], overview: {}, loading: false, error: 'Failed to load themes.' });
      } else {
        setState({ themes, overview, loading: false, error: null });
      }
    });
    return () => { cancelled = true; };
  }, []);

  return state;
}
