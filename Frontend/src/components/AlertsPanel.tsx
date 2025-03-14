import React, { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import { Alert } from '../types/api';

interface Props {
  alerts: Alert[];
  onCreateAlert: (alert: Omit<Alert, 'id'>) => void;
}

export const AlertsPanel: React.FC<Props> = ({ alerts, onCreateAlert }) => {
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    assetId: '',
    type: 'PRICE' as const,
    threshold: 0,
    condition: 'ABOVE' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAlert({
      ...newAlert,
      userId: 'current-user', // This should come from auth context
      active: true,
    });
    setShowForm(false);
    setNewAlert({
      assetId: '',
      type: 'PRICE',
      threshold: 0,
      condition: 'ABOVE',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alerts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Alert
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset
              </label>
              <input
                type="text"
                value={newAlert.assetId}
                onChange={(e) => setNewAlert({ ...newAlert, assetId: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as 'PRICE' | 'PORTFOLIO' })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="PRICE">Price Alert</option>
                <option value="PORTFOLIO">Portfolio Alert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold
              </label>
              <input
                type="number"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: parseFloat(e.target.value) })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={newAlert.condition}
                onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'ABOVE' | 'BELOW' })}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="ABOVE">Above</option>
                <option value="BELOW">Below</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Alert
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <Bell className={`w-5 h-5 ${alert.active ? 'text-blue-500' : 'text-gray-400'} mr-3`} />
              <div>
                <p className="font-medium text-gray-900">
                  {alert.type === 'PRICE' ? 'Price Alert' : 'Portfolio Alert'}
                </p>
                <p className="text-sm text-gray-500">
                  {alert.assetId} {alert.condition.toLowerCase()} ${alert.threshold}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  alert.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {alert.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};