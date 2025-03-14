import axios from 'axios';
import { Portfolio, Transaction, MarketData, Alert } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPortfolio = async (userId: string): Promise<Portfolio> => {
  const response = await api.get(`/portfolio/${userId}`);
  return response.data;
};

export const getTransactions = async (params: {
  userId: string;
  assetId?: string;
  type?: 'BUY' | 'SELL';
  start?: string;
  end?: string;
}): Promise<Transaction[]> => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const getMarketData = async (): Promise<MarketData[]> => {
  const response = await api.get('/market-data');
  return response.data;
};

export const getAlerts = async (userId: string): Promise<Alert[]> => {
  const response = await api.get('/alerts', { params: { userId } });
  return response.data;
};

export const createAlert = async (alert: Omit<Alert, 'id'>): Promise<Alert> => {
  const response = await api.post('/alerts', alert);
  return response.data;
};