
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { PURGE } from 'redux-persist';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  image:string;
  historical_prices: { timestamp: string; price: number }[];
}

interface DataState {
  symbol: string;
  data: CryptoData[];
}

const initialState: DataState = {
  symbol: 'solana',
  data: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<CryptoData[]>) {
      state.data = action.payload;
    },
    setSymbol(state, action: PayloadAction<string>) {
      state.symbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      state.data = [];
      state.symbol = 'solana';
    });
  },
});

export const { setData, setSymbol } = dataSlice.actions;
export const selectData = (state: RootState) => state.data.data;
export const selectSymbol = (state: RootState) => state.data.symbol;

export default dataSlice.reducer;
