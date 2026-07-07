import { coinGeckoClient } from '../config/coinGeckoClient.js';
import { getOrSetCache, CACHE_TTL } from '../config/cache.js';

// ADAPTADOR PARA SERVICOS EXTERNOS
export class CoinGeckoAdapter {
  
  async getSimplePrices(cryptoIds: string[], vsCurrencies: string[]) {
    const sortedIds = [...cryptoIds].sort().join(',');
    const sortedCurrencies = [...vsCurrencies].sort().join(',');
    const cacheKey = `simple_price_${sortedIds}_${sortedCurrencies}`;

    return getOrSetCache(cacheKey, CACHE_TTL.simplePrice, async () => {
      try {
        const response = await coinGeckoClient.get('/simple/price', {
          params: {
            ids: cryptoIds.join(','),
            vs_currencies: vsCurrencies.join(','),
            include_24hr_change: 'true'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar dados na CoinGecko:', error);
        throw new Error('Não foi possível obter os dados do mercado.');
      }
    });
  }

  async getPriceCoinByToken(networkId: string, contractAddress: string) {
    const netId = networkId.trim().toLowerCase();
    const address = contractAddress.trim().toLowerCase();
    const cacheKey = `token_price_${netId}_${address}`;

    return getOrSetCache(cacheKey, CACHE_TTL.tokenPrice, async () => {
      try {
        const response = await coinGeckoClient.get(`/simple/token_price/${netId}`, {
          params: {
            contract_addresses: address,
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true,
            include_last_updated_at: true
          }
        });
        return response.data;  
      } catch (error: any) {
         console.error("Erro ao buscar informações sobre o token:", error.response?.data || error.message);
         throw new Error('Não foi possível obter os dados sobre o token!');
      }
    });
  }

  async getCoinsMarkets(vsCurrency: string = 'usd', coinIds?: string[]) {
    const currency = vsCurrency.toLowerCase().trim();
    const sortedIds = coinIds && coinIds.length > 0 ? [...coinIds].sort().join(',') : 'all';
    const cacheKey = `coins_markets_${currency}_${sortedIds}`;

    return getOrSetCache(cacheKey, CACHE_TTL.markets, async () => {
      try {
        const response = await coinGeckoClient.get('/coins/markets', {
          params: {
            vs_currency: currency,
            ids: coinIds && coinIds.length > 0 ? coinIds.join(',') : undefined,
            order: 'market_cap_desc', 
            per_page: 100,            
            page: 1,                
            sparkline: false,       
            price_change_percentage: '24h'
          }
        });
        return response.data;
      } catch (error: any) {
        console.error("Erro ao buscar lista de mercados na CoinGecko:", error.response?.data || error.message);
        throw new Error('Não foi possível obter a lista de moedas.');
      }
    });
  }

  async getAssetData(coinId: string) {
    const id = coinId.trim().toLowerCase();
    const cacheKey = `asset_data_${id}`;

    return getOrSetCache(cacheKey, CACHE_TTL.coinDetails, async () => { 
      try {
        const response = await coinGeckoClient.get(`/coins/${id}`, {
          params: {
            localization: 'false',
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          }
        });
        return response.data;
      } catch (error: any) {
        console.error(`Erro ao buscar dados da moeda ${coinId}:`, error.response?.data || error.message);
        throw new Error('Não foi possível obter os detalhes da moeda.');
      }
    });
  }

  async getMarketChart(coinId: string, vsCurrency: string = 'usd', days: string = '7') {
    const id = coinId.trim().toLowerCase();
    const currency = vsCurrency.toLowerCase().trim();
    const cacheKey = `market_chart_${id}_${currency}_${days}`;

    return getOrSetCache(cacheKey, CACHE_TTL.chart, async () => {
      try {
        const response = await coinGeckoClient.get(`/coins/${id}/market_chart`, {
          params: {
            vs_currency: currency,
            days: days,
            interval: days === '1' ? 'hourly' : 'daily'
          }
        });
        return response.data;
      } catch (error: any) {
        console.error(`Erro ao buscar gráfico histórico para ${coinId}:`, error.response?.data || error.message);
        throw new Error('Não foi possível obter os dados do gráfico histórico.');
      }
    });
  }

  async getAssetPlatforms() {
    return getOrSetCache('asset_platforms', CACHE_TTL.platforms, async () => {
      try {
        const response = await coinGeckoClient.get('/asset_platforms');
        return response.data;
      } catch (error: any) {
        console.error("Erro ao buscar plataformas de ativos:", error.response?.data || error.message);
        throw new Error('Não foi possível obter la lista de plataformas.');
      }
    });
  }

  async getGlobalMarketData() {
    return getOrSetCache('global_market_data', CACHE_TTL.global, async () => {
      try {
        const response = await coinGeckoClient.get('/global');
        return response.data;
      } catch (error: any) {
        console.error("Erro ao buscar dados globais do mercado:", error.response?.data || error.message);
        throw new Error('Não foi possível obter os dados globais do mercado.');
      }
    });
  }

  async getTrendingCoins() {
    return getOrSetCache('trending_coins', CACHE_TTL.global, async () => {
      try {
        const response = await coinGeckoClient.get('/search/trending');
        return response.data;
      } catch (error: any) {
        console.error("Erro ao buscar moedas em tendência:", error.response?.data || error.message);
        throw new Error('Não foi possível obter as moedas em tendência.');
      }
    });
  }

  async getMarketCategories() {
    return getOrSetCache('market_categories', CACHE_TTL.categories, async () => {
      try {
        const response = await coinGeckoClient.get('/coins/categories', {
          params: { order: 'market_cap_desc' }
        });
        return response.data;
      } catch (error: any) {
        console.error("Erro ao buscar categorias de mercado:", error.response?.data || error.message);
        throw new Error('Não foi possível obter as categorias de mercado.');
      }
    });
  }
}