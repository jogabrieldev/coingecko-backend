import { Router } from 'express';
import { getCryptoPrices, getPriceCoin,
    getCoinsMarketsList,getCoinDetails,getCoinMarketChart,
    getPlatformsList,getCategoriesList,
    getGlobalData,getTrendingList,getTopMovers 
} from '../controller/cryptoController.js';

//ROUTES
const router = Router();

router.get('/market/global', getGlobalData);      // GET /api/market/global
router.get('/market/trending', getTrendingList);  // GET /api/market/trending
router.get('/market/categories', getCategoriesList); // GET /api/market/categories
router.get('/market/top-movers', getTopMovers)

router.get('/prices', getCryptoPrices);
router.get('/price/token', getPriceCoin)
router.get('/coins/markets', getCoinsMarketsList);
router.get('/platforms', getPlatformsList); // GET /api/platforms

router.get('/coins/:id', getCoinDetails); // GET /api/coins/bitcoin
router.get('/coins/:id/chart', getCoinMarketChart); 

export default router;