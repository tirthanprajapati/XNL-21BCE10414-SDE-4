import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Portfolio } from '../types/api';

interface Props {
  portfolio: Portfolio;
}

export const PortfolioSummary: React.FC<Props> = ({ portfolio }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Summary</h2>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-green-500" />
          <span className="text-2xl font-bold text-gray-900">
            ${portfolio.totalValue.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Daily</span>
            <div className="flex items-center">
              {portfolio.performance.daily >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={portfolio.performance.daily >= 0 ? 'text-green-500' : 'text-red-500'}>
                {portfolio.performance.daily}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Weekly</span>
            <div className="flex items-center">
              {portfolio.performance.weekly >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={portfolio.performance.weekly >= 0 ? 'text-green-500' : 'text-red-500'}>
                {portfolio.performance.weekly}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Monthly</span>
            <div className="flex items-center">
              {portfolio.performance.monthly >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={portfolio.performance.monthly >= 0 ? 'text-green-500' : 'text-red-500'}>
                {portfolio.performance.monthly}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};