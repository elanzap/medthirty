import React, { useState } from 'react';
import type { Medication } from '../../types';

interface DiagnosisFormProps {
  medications: string[];
  dosages: string[];
  intervals: string[];
  durations: string[];
  labTests: string[];
  onSubmit: (data: {
    name: string;
    medications: Medication[];
    labTests: string[];
  }) => void;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  medications,
  dosages,
  intervals,
  durations,
  labTests,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    selectedMedications: [] as Medication[],
    selectedLabTests: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      medications: formData.selectedMedications,
      labTests: formData.selectedLabTests,
    });
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      selectedMedications: [
        ...prev.selectedMedications,
        {
          name: '',
          dosage: '',
          interval: '',
          duration: '',
          instructions: '',
        },
      ],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diagnosis Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Medications</h3>
          <button
            type="button"
            onClick={addMedication}
            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Medication
          </button>
        </div>

        {formData.selectedMedications.map((med, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medication</label>
              <select
                value={med.name}
                onChange={(e) => {
                  const newMeds = [...formData.selectedMedications];
                  newMeds[index].name = e.target.value;
                  setFormData(prev => ({ ...prev, selectedMedications: newMeds }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select medication...</option>
                {medications.map(med => (
                  <option key={med} value={med}>{med}</option>
                ))}
              </select>
            </div>

            {/* Similar dropdowns for dosage, interval, and duration */}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lab Tests</h3>
        <select
          multiple
          value={formData.selectedLabTests}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, selectedLabTests: selected }));
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {labTests.map(test => (
            <option key={test} value={test}>{test}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Diagnosis
        </button>
      </div>
    </form>
  );
};
