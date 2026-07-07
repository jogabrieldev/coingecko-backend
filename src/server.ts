import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/cryptoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'CoinGecko Integration API is running!' 
  });
});

app.use('/api', cryptoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});