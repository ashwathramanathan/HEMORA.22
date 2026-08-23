import type { LocationData } from "./data";

/** Lightweight fuzzy scorer: rewards prefix, word-boundary, and subsequence hits. */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (!q) return 0;
  if (t === q) return 1000;
  if (t.startsWith(q)) return 800 - (t.length - q.length);
  const wordStart = t.split(/[\s(),./-]+/).some((w) => w.startsWith(q));
  if (wordStart) return 600 - (t.length - q.length);
  if (t.includes(q)) return 400 - t.indexOf(q);

  // subsequence match (typo / gap tolerant)
  let qi = 0;
  let score = 0;
  let lastIdx = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += lastIdx === ti - 1 ? 8 : 3; // reward consecutive matches
      lastIdx = ti;
      qi++;
    }
  }
  if (qi === q.length) return 100 + score;
  return -1;
}

export interface SearchHit {
  loc: LocationData;
  score: number;
  matchedField: string;
}

export function searchLocations(query: string, locations: LocationData[], limit = 8): SearchHit[] {
  const q = query.trim();
  if (!q) {
    return locations
      .slice()
      .sort((a, b) => b.surface_water_pollution_pct - a.surface_water_pollution_pct)
      .slice(0, limit)
      .map((loc) => ({ loc, score: 0, matchedField: "" }));
  }

  const hits: SearchHit[] = [];
  for (const loc of locations) {
    const fields: [string, string][] = [
      [loc.location_name, "name"],
      [loc.state_ut, "state"],
      [loc.city_type, "type"],
      [loc.key_heavy_metal, "metal"],
    ];
    let best = -1;
    let bestField = "";
    for (const [val, field] of fields) {
      const s = fuzzyScore(q, val);
      // name matches weighted highest
      const weighted = field === "name" ? s * 1.4 : field === "state" ? s * 1.1 : s;
      if (weighted > best) {
        best = weighted;
        bestField = field;
      }
    }
    if (best > 0) hits.push({ loc, score: best, matchedField: bestField });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
