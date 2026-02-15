const cache = new Map<string, number>();

export function getCachedScore(id: string, compute: () => number) {
  const v = cache.get(id);
  if (v !== undefined) return v;
  const next = compute();
  cache.set(id, next);
  return next;
}