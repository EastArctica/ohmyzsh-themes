import { useCallback, useEffect, useState } from 'react';

const KEY = 'omz-favs';

function load(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function save(favs: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...favs]));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(load);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setFavorites(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((name: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      save(next);
      return next;
    });
  }, []);

  return { favorites, toggle };
}
