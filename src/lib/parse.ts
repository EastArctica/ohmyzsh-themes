import type { OverviewMap, Theme } from '../types';

export function parseThemes(md: string): Theme[] {
  const themes: Theme[] = [];
  const sections = md.split(/\n(?=### )/);

  for (const sec of sections) {
    if (!sec.startsWith('### ')) continue;
    const lines = sec.split('\n');
    const name = lines[0].slice(4).trim();

    // Filter out non-slug names (headings like "### Version 2019-08", etc.)
    if (!/^[\w+.-]+$/.test(name)) continue;

    const imgMatch = sec.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/);
    if (!imgMatch) continue;
    const imageUrl = imgMatch[1];

    const descParts: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.startsWith('---')) break;
      if (!t || t.startsWith('#') || t.startsWith('![')) continue;
      descParts.push(t);
    }

    themes.push({ name, imageUrl, description: descParts.join('\n').trim() });
  }

  return themes;
}

export function parseOverview(md: string): OverviewMap {
  const map: OverviewMap = {};
  const lines = md.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (!inTable) {
      if (line.startsWith('| Theme') && line.includes('Username')) inTable = true;
      continue;
    }
    if (!line.startsWith('|')) break;
    if (line.includes('---')) continue;
    if (line.startsWith('| Theme')) continue;

    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 6) continue;
    const [theme, username, hostname, timedate, lastfail, pwdstyle, otherinfo = ''] = cells;
    if (!theme) continue;

    const features = [...new Set(
      otherinfo.split(',').map(f => f.trim()).filter(f => f && f !== '-'),
    )];

    map[theme] = {
      username:    username === 'True',
      hostname:    hostname === 'True',
      timedate:    timedate === 'True',
      lastFailure: lastfail === 'True',
      pwdStyle:    pwdstyle,
      features,
    };
  }

  return map;
}
