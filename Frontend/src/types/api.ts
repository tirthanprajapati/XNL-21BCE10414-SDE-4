export interface Portfolio {
  userId: string;
  assets: Asset[];
  totalValue: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  change24h: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  userId: string;
  assetId: string;
  type: 'PRICE' | 'PORTFOLIO';
  threshold: number;
  condition: 'ABOVE' | 'BELOW';
  active: boolean;
}