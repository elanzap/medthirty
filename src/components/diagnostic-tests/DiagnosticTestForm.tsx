import React, { useState } from 'react';
import type { DiagnosticTest } from '../../types';
import { useGeneralSettingsStore } from '../../stores/generalSettingsStore';

interface DiagnosticTestFormProps {
  initialData?: DiagnosticTest;
  onSubmit: (data: Omit<DiagnosticTest, 'id'>) => void;
  onCancel: () => void;
}

export const DiagnosticTestForm: React.FC<DiagnosticTestFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { settings } = useGeneralSettingsStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      price: Number(formData.price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Test Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Test Price
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">
              {settings.defaultCurrency === 'USD' && '$'}
              {settings.defaultCurrency === 'EUR' && '€'}
              {settings.defaultCurrency === 'GBP' && '£'}
              {settings.defaultCurrency === 'INR' && '₹'}
              {settings.defaultCurrency === 'JPY' && '¥'}
              {settings.defaultCurrency === 'CAD' && 'CA$'}
              {settings.defaultCurrency === 'AUD' && 'A$'}
            </span>
          </div>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {initialData ? 'Update' : 'Add'} Test
        </button>
      </div>
    </form>
  );
};
