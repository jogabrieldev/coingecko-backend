import { CoinGeckoAdapter } from '../adapters/coinGeckoAdapter.js';

const coinGeckoAdapter = new CoinGeckoAdapter();

//SERVICE
export class CoinGeckoService {
 
    async getTopGainersLosers(vsCurrency: string = 'usd', limit: number = 10) {
      const allCoins = await coinGeckoAdapter.getCoinsMarkets(vsCurrency);
        const validCoins = allCoins.filter((coin: any) => 
         coin.price_change_percentage_24h !== null
         && coin.price_change_percentage_24h !== undefined
        );
        const sorted = [...validCoins].sort((a: any, b: any) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        return {
         top_gainers: sorted.slice(0, limit),
         top_losers: sorted.slice(-limit).reverse(),
        };
    }
}