import NodeCache from 'node-cache';

//CACHE
export const marketCache = new NodeCache({ checkperiod: 60 });

export const CACHE_TTL = {
  markets: 30,     
  topMovers: 30, 
  chart: 300,
  global: 60,
  platforms: 3600,
  categories: 3600,
  simplePrice: 30,
  tokenPrice: 60,
  coinDetails: 120
};

export async function getOrSetCache<T>(key: string,ttlSeconds: number,fetchFn: () => Promise<T>): Promise<T> {
  const cached = marketCache.get<T>(key);
  if (cached !== undefined) return cached;
  const fresh = await fetchFn();
  marketCache.set(key, fresh, ttlSeconds);
  return fresh;
}