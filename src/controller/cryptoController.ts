import type { Request, Response } from 'express';
import { CoinGeckoAdapter } from '../adapters/coinGeckoAdapter.js';

const coinGeckoAdapter = new CoinGeckoAdapter();

export const getCryptoPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await coinGeckoAdapter.getSimplePrices(
      ['bitcoin', 'ethereum', 'solana'], 
      ['usd', 'brl']
    );
    
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPriceCoin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { network, contract } = req.query;

      if (!network || !contract) {
        res.status(400).json({ 
          success: false, 
          error: "Os parâmetros 'network' e 'contract' são obrigatórios." 
        });
        return;
      }

      const data = await coinGeckoAdapter.getPriceCoinByToken(
        String(network), 
        String(contract)
      );

      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Erro no controller getPriceCoin:", error.message);
      res.status(500).json({ success: false, error: error.message }); 
    } 
};

export const getCoinsMarketsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vs_currency, ids } = req.query;
    if(!vs_currency){
        res.status(400).json({ 
          success: false, 
          error: "Os parâmetros 'vs_currency' e 'Ids' são obrigatórios." 
        });
    }
    const coinIdsArray = ids ? String(ids).split(',') : undefined;
    const data = await coinGeckoAdapter.getCoinsMarkets(vs_currency ? String(vs_currency) : 'usd',coinIdsArray);

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Erro no controller getCoinsMarketsList:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCoinDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; 
    if(!id){
       res.status(400).json({ 
          success: false, 
          error: "Os parâmetros 'Ids' são obrigatórios." 
        });
    }
    const data = await coinGeckoAdapter.getAssetData(String(id));
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Novo: Gráfico histórico de uma moeda
export const getCoinMarketChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { vs_currency, days } = req.query;
    if(!id){
        res.status(400).json({ 
          success: false, 
          error: "Os parâmetros 'Ids' são obrigatórios." 
        });
    }
        
    const data = await coinGeckoAdapter.getMarketChart(String(id), vs_currency ? String(vs_currency) : 'usd',days ? String(days) : '7');
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Novo: Lista de redes/plataformas suportadas
export const getPlatformsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await coinGeckoAdapter.getAssetPlatforms();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getGlobalData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await coinGeckoAdapter.getGlobalMarketData();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTrendingList = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await coinGeckoAdapter.getTrendingCoins();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCategoriesList = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await coinGeckoAdapter.getMarketCategories();
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
