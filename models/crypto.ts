import mongoose, { Document, Schema } from 'mongoose';

interface ICrypto extends Document {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  historical_prices: { timestamp: Date; price: number }[];
}

const CryptoSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  current_price: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  market_cap_rank: { type: Number, required: true },
  historical_prices: [{ timestamp: { type: Date, required: true }, price: { type: Number, required: true } }],
});

export default mongoose.models.Crypto || mongoose.model<ICrypto>('Crypto', CryptoSchema);