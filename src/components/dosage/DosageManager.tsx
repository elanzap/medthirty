import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDosageStore } from '../../stores/dosageStore';

export const DosageManager: React.FC = () => {
  const { dosages, addDosage, removeDosage } = useDosageStore();
  const [newDosage, setNewDosage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDosage.trim()) {
      addDosage(newDosage.trim());
      setNewDosage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Dosage Management</h2>
        
        {/* Add Dosage Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                Add Dosage
              </label>
              <input
                type="text"
                id="dosage"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g., 1 Tablet, 10ml, 2 Capsules"
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

        {/* Dosages List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Available Dosages</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {dosages.map((dosage, index) => (
                <li key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <span className="text-sm text-gray-900">{dosage}</span>
                  <button
                    onClick={() => removeDosage(dosage)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
              {dosages.length === 0 && (
                <li className="px-6 py-4 text-sm text-gray-500 text-center">
                  No dosages added yet
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
