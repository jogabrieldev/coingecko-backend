import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const coinGeckoClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
  }
});