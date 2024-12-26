import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Medication } from '../../types';
import { useIntervalStore } from '../../stores/intervalStore';
import { useDosageStore } from '../../stores/dosageStore';
import { useDurationStore } from '../../stores/durationStore';
import { useDrugStore } from '../../stores/drugStore';
import { SearchableSelect } from '../common/SearchableSelect';

interface MedicationListProps {
  medications: Medication[];
  onUpdate: (medications: Medication[]) => void;
}

export const MedicationList: React.FC<MedicationListProps> = ({ medications, onUpdate }) => {
  const { intervals } = useIntervalStore();
  const { dosages } = useDosageStore();
  const { durations } = useDurationStore();
  const { drugs } = useDrugStore();
  const [editingMedication, setEditingMedication] = useState<{ index: number; medication: Medication } | null>(null);
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    interval: '',
    duration: '',
    instructions: ''
  });

  const getDrugDisplayName = (drug: any) => {
    return `${drug.type}. ${drug.name} ${drug.strength}`;
  };

  const drugOptions = drugs.map(drug => ({
    value: getDrugDisplayName(drug),
    label: getDrugDisplayName(drug)
  }));

  const dosageOptions = dosages.map(dosage => ({
    value: dosage,
    label: dosage
  }));

  const intervalOptions = intervals.map(interval => ({
    value: interval,
    label: interval
  }));

  const durationOptions = durations.map(duration => ({
    value: duration,
    label: duration
  }));

  const handleDelete = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    onUpdate(updatedMedications);
  };

  const handleEdit = (index: number) => {
    setEditingMedication({ index, medication: { ...medications[index] } });
  };

  const handleUpdate = () => {
    if (editingMedication) {
      const updatedMedications = [...medications];
      updatedMedications[editingMedication.index] = editingMedication.medication;
      onUpdate(updatedMedications);
      setEditingMedication(null);
    }
  };

  const handleAdd = () => {
    onUpdate([...medications, newMedication]);
    setNewMedication({
      name: '',
      dosage: '',
      interval: '',
      duration: '',
      instructions: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Medications</h3>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dosage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Interval</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Instructions</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {medications.map((medication, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900">{medication.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{medication.dosage}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{medication.interval}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{medication.duration}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{medication.instructions}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Add New Medication</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <SearchableSelect
              options={drugOptions}
              value={newMedication.name}
              onChange={(value) => setNewMedication(prev => ({ ...prev, name: value }))}
              placeholder="Search medication..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
            <SearchableSelect
              options={dosageOptions}
              value={newMedication.dosage}
              onChange={(value) => setNewMedication(prev => ({ ...prev, dosage: value }))}
              placeholder="Search dosage..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
            <SearchableSelect
              options={intervalOptions}
              value={newMedication.interval}
              onChange={(value) => setNewMedication(prev => ({ ...prev, interval: value }))}
              placeholder="Search interval..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <SearchableSelect
              options={durationOptions}
              value={newMedication.duration}
              onChange={(value) => setNewMedication(prev => ({ ...prev, duration: value }))}
              placeholder="Search duration..."
            />
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <input
              type="text"
              value={newMedication.instructions}
              onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter medication instructions..."
            />
          </div>
          <div className="col-span-4 flex justify-end">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newMedication.name}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </button>
          </div>
        </div>
      </div>

      {/* Edit Medication Modal */}
      {editingMedication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Medication</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <SearchableSelect
                    options={drugOptions}
                    value={editingMedication.medication.name}
                    onChange={(value) => setEditingMedication(prev => ({
                      ...prev!,
                      medication: { ...prev!.medication, name: value }
                    }))}
                    placeholder="Search medication..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <SearchableSelect
                    options={dosageOptions}
                    value={editingMedication.medication.dosage}
                    onChange={(value) => setEditingMedication(prev => ({
                      ...prev!,
                      medication: { ...prev!.medication, dosage: value }
                    }))}
                    placeholder="Search dosage..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interval</label>
                  <SearchableSelect
                    options={intervalOptions}
                    value={editingMedication.medication.interval}
                    onChange={(value) => setEditingMedication(prev => ({
                      ...prev!,
                      medication: { ...prev!.medication, interval: value }
                    }))}
                    placeholder="Search interval..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <SearchableSelect
                    options={durationOptions}
                    value={editingMedication.medication.duration}
                    onChange={(value) => setEditingMedication(prev => ({
                      ...prev!,
                      medication: { ...prev!.medication, duration: value }
                    }))}
                    placeholder="Search duration..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Instructions</label>
                  <input
                    type="text"
                    value={editingMedication.medication.instructions}
                    onChange={(e) => setEditingMedication(prev => ({
                      ...prev!,
                      medication: { ...prev!.medication, instructions: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingMedication(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
