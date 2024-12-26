import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface ItemManagementProps {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
  onImportCSV: (items: string[]) => void;
}

export const ItemManagement: React.FC<ItemManagementProps> = ({
  title,
  items,
  onAddItem,
  onImportCSV,
}) => {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      const items = text.split('\n').map(line => line.trim()).filter(Boolean);
      onImportCSV(items);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New {title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {title} Name
            </label>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add {title}
            </button>
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Existing {title}</h3>
        {items.length === 0 ? (
          <p className="text-gray-500">No items added yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <li key={index} className="py-3">{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
