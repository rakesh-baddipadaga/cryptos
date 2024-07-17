import cron from 'node-cron';
import axios from 'axios';
import dbConnect from './dbconnect';
import Crypto from '../models/crypto';

const symbols = [
  'bitcoin',
  'ethereum',
  'tether',
  'binancecoin',
  'solana',
];

const fetchCryptoData = async () => {
  try {
    await dbConnect();

    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: symbols.join(','),
      },
    });

    const cryptos = response.data.map((crypto: any) => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: crypto.image,
      current_price: crypto.current_price,
      market_cap: crypto.market_cap,
      market_cap_rank: crypto.market_cap_rank,
    }));

    for (const crypto of cryptos) {
      const existingCrypto = await Crypto.findOne({ id: crypto.id });

      if (existingCrypto) {
        // Update existing record with current price, historical data
        existingCrypto.historical_prices.push({
          timestamp: new Date(),
          price: crypto.current_price,
        });
        existingCrypto.current_price = crypto.current_price;
        existingCrypto.market_cap = crypto.market_cap;
        existingCrypto.market_cap_rank = crypto.market_cap_rank;
        await existingCrypto.save();
      } else {
        // Create new record if it doesn't exist
        await Crypto.create({
          ...crypto,
          historical_prices: [{ timestamp: new Date(), price: crypto.current_price }],
        });
      }
    }

    console.log('Crypto data updated successfully.');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
};

// Schedule the task to run every 5 min
cron.schedule('*/5* * * *', fetchCryptoData);