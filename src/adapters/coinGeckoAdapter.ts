import { coinGeckoClient } from '../config/coinGeckoClient.js';

export class CoinGeckoAdapter {
  async getSimplePrices(cryptoIds: string[], vsCurrencies: string[]) {
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
  }

 async getPriceCoinByToken(networkId: string, contractAddress: string) {
    try {
      const response = await coinGeckoClient.get(`/simple/token_price/${networkId.trim()}`, {
        params: {
          contract_addresses: contractAddress.trim(),
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
  }

  // Coins 
  async getCoinsMarkets(vsCurrency: string = 'usd', coinIds?: string[]) {
    try {
      const response = await coinGeckoClient.get('/coins/markets', {
        params: {
          vs_currency: vsCurrency.toLowerCase().trim(),
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
  }
  async getAssetData(coinId: string) {
    try {
      const response = await coinGeckoClient.get(`/coins/${coinId.trim().toLowerCase()}`, {
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
  }

  async getMarketChart(coinId: string, vsCurrency: string = 'usd', days: string = '7') {
    try {
      const response = await coinGeckoClient.get(`/coins/${coinId.trim().toLowerCase()}/market_chart`, {
        params: {
          vs_currency: vsCurrency.toLowerCase().trim(),
          days: days,
          interval: days === '1' ? 'hourly' : 'daily'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar gráfico histórico para ${coinId}:`, error.response?.data || error.message);
      throw new Error('Não foi possível obter os dados do gráfico histórico.');
    }
  }

  async getAssetPlatforms() {
    try {
      const response = await coinGeckoClient.get('/asset_platforms');
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar plataformas de ativos:", error.response?.data || error.message);
      throw new Error('Não foi possível obter a lista de plataformas.');
    }
  }

  async getGlobalMarketData() {
  try {
    const response = await coinGeckoClient.get('/global');
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar dados globais do mercado:", error.response?.data || error.message);
    throw new Error('Não foi possível obter os dados globais do mercado.');
  }
}

async getTrendingCoins() {
  try {
    const response = await coinGeckoClient.get('/search/trending');
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar moedas em tendência:", error.response?.data || error.message);
    throw new Error('Não foi possível obter as moedas em tendência.');
  }
}

async getMarketCategories() {
  try {
    const response = await coinGeckoClient.get('/coins/categories', {
      params: {
        order: 'market_cap_desc'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar categorias de mercado:", error.response?.data || error.message);
    throw new Error('Não foi possível obter as categorias de mercado.');
  }
}
}