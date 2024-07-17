import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { setData, selectData, selectSymbol } from '../../../store/dataslice';
import axios from 'axios';
import styles from './cryptotable.module.css'; 

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  image: string;
  historical_prices: { timestamp: string; price: number }[];
}

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const symbol = useSelector(selectSymbol);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CryptoData[]>(`/api/data?symbol=${symbol}`);
        dispatch(setData(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state or display error message
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [symbol, dispatch]);

  const renderHistoricalPrices = (crypto: CryptoData) => {
    if (!crypto.historical_prices || crypto.historical_prices.length === 0) {
      return <p>No historical prices available.</p>;
    }
      // Reverse the historical prices array to display the most recent prices first
  const reversedPrices = crypto.historical_prices.slice().reverse();

    return (
      <div className={styles.historicalPrices}>
        <h3>Last 20 Historical Prices for {symbol.toUpperCase()}</h3>
        <table className={styles.priceTable}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {reversedPrices.slice(0, 20).map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.cryptoTable}>
      <h2>Cryptocurrency Data for {symbol.toUpperCase()}</h2>
      <table className={styles.mainTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.id}</td>
              <td><img src={crypto.image} alt={crypto.name} className={styles.cryptoImage} />{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td>${crypto.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > 0 && renderHistoricalPrices(data[0])}
    </div>
  );
};

export default CryptoTable;