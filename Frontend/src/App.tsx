import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  getPortfolio,
  getTransactions,
  getMarketData,
  getAlerts,
  createAlert,
} from './api';
import { Portfolio, Transaction, MarketData, Alert } from './types/api';
import { PortfolioSummary } from './components/PortfolioSummary';
import { AssetList } from './components/AssetList';
import { TransactionHistory } from './components/TransactionHistory';
import { MarketAnalytics } from './components/MarketAnalytics';
import { AlertsPanel } from './components/AlertsPanel';

const MOCK_USER_ID = '3319'; // This should come from auth context

function App() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

    socket.on('market-update', (data: MarketData) => {
      setMarketData((prev) => [...prev, data]);
    });

    socket.on('transaction-update', (data: Transaction) => {
      setTransactions((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [portfolioData, transactionsData, marketDataResponse, alertsData] = await Promise.all([
          getPortfolio(MOCK_USER_ID),
          getTransactions({ userId: MOCK_USER_ID }),
          getMarketData(),
          getAlerts(MOCK_USER_ID),
        ]);

        setPortfolio(portfolioData);
        setTransactions(transactionsData);
        setMarketData(marketDataResponse);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleFilterChange = async (filters: {
    assetId?: string;
    type?: 'BUY' | 'SELL';
    start?: string;
    end?: string;
  }) => {
    try {
      const filteredTransactions = await getTransactions({
        userId: MOCK_USER_ID,
        ...filters,
      });
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  };

  const handleCreateAlert = async (alert: Omit<Alert, 'id'>) => {
    try {
      const newAlert = await createAlert(alert);
      setAlerts((prev) => [...prev, newAlert]);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PortfolioSummary portfolio={portfolio} />
            <MarketAnalytics marketData={marketData} />
          </div>
          
          <AssetList assets={portfolio.assets} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TransactionHistory
              transactions={transactions}
              onFilterChange={handleFilterChange}
            />
            <AlertsPanel alerts={alerts} onCreateAlert={handleCreateAlert} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;