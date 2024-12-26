import React from 'react';
import type { VitalSigns } from '../../types';

interface VitalSignsFormProps {
  value: Partial<VitalSigns>;
  onChange: (vitalSigns: VitalSigns) => void;
}

export const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof VitalSigns, val: string) => {
    onChange({
      ...value,
      [field]: field === 'bloodPressure' ? val : Number(val),
    } as VitalSigns);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
        <input
          type="text"
          value={value.bloodPressure || ''}
          onChange={(e) => handleChange('bloodPressure', e.target.value)}
          placeholder="120/80"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Pulse Rate</label>
        <input
          type="number"
          value={value.pulseRate || ''}
          onChange={(e) => handleChange('pulseRate', e.target.value)}
          placeholder="72"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
        <input
          type="number"
          value={value.temperature || ''}
          onChange={(e) => handleChange('temperature', e.target.value)}
          step="0.1"
          placeholder="98.6"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
        <input
          type="number"
          value={value.weight || ''}
          onChange={(e) => handleChange('weight', e.target.value)}
          step="0.1"
          placeholder="70"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
