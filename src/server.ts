import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/cryptoRoutes.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'CoinGecko Integration API is running!' 
  });
});

app.use('/api', cryptoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});