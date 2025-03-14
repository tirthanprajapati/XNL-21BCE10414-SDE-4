import React, { useState } from 'react';
import { format } from 'date-fns';
import { Transaction } from '../types/api';

interface Props {
  transactions: Transaction[];
  onFilterChange: (filters: {
    assetId?: string;
    type?: 'BUY' | 'SELL';
    start?: string;
    end?: string;
  }) => void;
}

export const TransactionHistory: React.FC<Props> = ({ transactions, onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: '' as '' | 'BUY' | 'SELL',
    start: '',
    end: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input
            type="date"
            name="start"
            value={filters.start}
            onChange={handleFilterChange}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <input
            type="date"
            name="end"
            value={filters.end}
            onChange={handleFilterChange}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-right py-3 px-4">Quantity</th>
              <th className="text-right py-3 px-4">Price</th>
              <th className="text-right py-3 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  {format(new Date(transaction.timestamp), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      transaction.type === 'BUY'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="text-right py-4 px-4">{transaction.quantity}</td>
                <td className="text-right py-4 px-4">${transaction.price.toLocaleString()}</td>
                <td className="text-right py-4 px-4">
                  ${(transaction.quantity * transaction.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};