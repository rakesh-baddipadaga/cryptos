// utils/cronjob.ts
import cron from 'node-cron';
import axios, { AxiosError } from 'axios';
import dbConnect from './dbconnect';
import Crypto from '../models/crypto';

const symbols = [
  { type: 'crypto', id: 'bitcoin', symbol: 'BTC' },
  { type: 'crypto', id: 'ethereum', symbol: 'ETH' },
  { type: 'crypto', id: 'tether', symbol: 'USDT' },
  { type: 'crypto', id: 'binancecoin', symbol: 'BNB' },
  { type: 'crypto', id: 'solana', symbol: 'SOL' },
];

const fetchCryptoData = async (id: string, retryCount = 3) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    const data = response.data.market_data;
    return {
      id: response.data.id,
      symbol: response.data.symbol.toUpperCase(),
      name: response.data.name,
      image: response.data.image.large,
      current_price: data.current_price.usd,
      market_cap: data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
    };
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 429 && retryCount > 0) {
      const delaySeconds = Math.pow(2, 3 - retryCount);
      console.log(`Rate limited. Retrying after ${delaySeconds} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      return fetchCryptoData(id, retryCount - 1);
    } else {
      console.error(`Error fetching crypto data for ${id}:`, error);
      return null;
    }
  }
};

const fetchData = async (symbol: { type: string; id?: string; symbol: string }) => {
  let data = null;
  if (symbol.type === 'crypto' && symbol.id) {
    data = await fetchCryptoData(symbol.id);
  }

  if (data) {
    try {
      // Update or create record with current price and historical data
      const existingCrypto = await Crypto.findOne({ id: data.id });

      if (existingCrypto) {
        existingCrypto.historical_prices.push({
          timestamp: new Date(),
          price: data.current_price,
        });
        existingCrypto.current_price = data.current_price;
        existingCrypto.market_cap = data.market_cap;
        existingCrypto.market_cap_rank = data.market_cap_rank;
        await existingCrypto.save();
      } else {
        await Crypto.create({
          ...data,
          historical_prices: [{ timestamp: new Date(), price: data.current_price }],
        });
      }

      console.log(`Data updated for ${symbol.symbol}`);
    } catch (error) {
      console.error(`Error saving data for ${symbol.symbol}:`, error);
    }
  }
};

const setupCronJob = () => {
  cron.schedule('*/2 * * * *', async () => {
    await dbConnect();
    for (const symbol of symbols) {
      await fetchData(symbol);
    }
    console.log('Data polled successfully');
  });
};

setupCronJob();
