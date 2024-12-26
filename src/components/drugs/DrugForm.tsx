import React, { useState } from 'react';
import { SearchableSelect } from '../common/SearchableSelect';
import type { Drug } from '../../types';

interface DrugFormProps {
  initialData?: Drug;
  onSubmit: (data: Omit<Drug, 'id'>) => void;
  onCancel: () => void;
}

const DRUG_TYPES = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Injection',
  'Drops',
  'Cream',
  'Gel',
  'Ointment'
] as const;

export const DrugForm: React.FC<DrugFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'Tablet',
    strength: initialData?.strength || '',
    genericName: initialData?.genericName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Drug Name*
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
        <SearchableSelect
          label="Type*"
          options={DRUG_TYPES.map(type => ({
            value: type,
            label: type
          }))}
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value as Drug['type'] })}
          placeholder="Select type..."
          required
        />
      </div>

      <div>
        <label htmlFor="strength" className="block text-sm font-medium text-gray-700">
          Strength*
        </label>
        <input
          type="text"
          id="strength"
          value={formData.strength}
          onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
          placeholder="e.g., 500mg, 5ml"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="genericName" className="block text-sm font-medium text-gray-700">
          Generic Name
        </label>
        <input
          type="text"
          id="genericName"
          value={formData.genericName}
          onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
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
          {initialData ? 'Update' : 'Add'} Drug
        </button>
      </div>
    </form>
  );
};
