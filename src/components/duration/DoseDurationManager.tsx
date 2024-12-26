import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDurationStore } from '../../stores/durationStore';

export const DoseDurationManager: React.FC = () => {
  const { durations, addDuration, removeDuration } = useDurationStore();
  const [newDuration, setNewDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDuration.trim()) {
      addDuration(newDuration.trim());
      setNewDuration('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Dose Duration Management</h2>
        
        {/* Add Duration Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Add Duration
              </label>
              <input
                type="text"
                id="duration"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="e.g., 7 days, 2 weeks, 1 month"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>
          </div>
        </form>

        {/* Durations List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Available Durations</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {durations.map((duration, index) => (
                <li key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <span className="text-sm text-gray-900">{duration}</span>
                  <button
                    onClick={() => removeDuration(duration)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
              {durations.length === 0 && (
                <li className="px-6 py-4 text-sm text-gray-500 text-center">
                  No durations added yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
