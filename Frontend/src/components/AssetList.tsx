import React from 'react';
import { Asset } from '../types/api';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  assets: Asset[];
}

export const AssetList: React.FC<Props> = ({ assets }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Asset</th>
              <th className="text-right py-3 px-4">Quantity</th>
              <th className="text-right py-3 px-4">Avg. Price</th>
              <th className="text-right py-3 px-4">Current Price</th>
              <th className="text-right py-3 px-4">Value</th>
              <th className="text-right py-3 px-4">24h Change</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{asset.symbol}</span>
                    <span className="ml-2 text-sm text-gray-500">{asset.name}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4">{asset.quantity.toLocaleString()}</td>
                <td className="text-right py-4 px-4">${asset.averagePrice.toLocaleString()}</td>
                <td className="text-right py-4 px-4">${asset.currentPrice.toLocaleString()}</td>
                <td className="text-right py-4 px-4">${asset.currentValue.toLocaleString()}</td>
                <td className="text-right py-4 px-4">
                  <div className="flex items-center justify-end">
                    {asset.performance.daily >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        asset.performance.daily >= 0 ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {asset.performance.daily}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};