import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MarketData } from '../types/api';

interface Props {
  marketData: MarketData[];
}

export const MarketAnalytics: React.FC<Props> = ({ marketData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Analytics</h2>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {marketData.slice(-3).map((data) => (
          <div key={data.symbol} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{data.symbol}</span>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold">${data.price.toLocaleString()}</span>
                <span
                  className={`text-sm ${
                    data.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {data.change24h >= 0 ? '+' : ''}{data.change24h}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};