import React, { useState } from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { useDiagnosisStore } from '../../../stores/diagnosisStore';

export const MedicationsSection: React.FC = () => {
  const { medications, addMedication, importMedications } = useDiagnosisStore();
  const [newMedication, setNewMedication] = useState({
    name: '',
    genericName: '',
    category: '',
    dosageForm: '',
    strength: '',
  });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedication.name.trim()) {
      addMedication(JSON.stringify(newMedication));
      setNewMedication({
        name: '',
        genericName: '',
        category: '',
        dosageForm: '',
        strength: '',
      });
      setShowForm(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const medications = text.split('\n')
          .map(line => line.trim())
          .filter(Boolean);
        importMedications(medications);
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Medications Management</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
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
      </div>

      {/* Add Medication Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Medicine Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
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
                  value={newMedication.genericName}
                  onChange={(e) => setNewMedication({ ...newMedication, genericName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={newMedication.category}
                  onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="dosageForm" className="block text-sm font-medium text-gray-700">
                  Dosage Form
                </label>
                <select
                  id="dosageForm"
                  value={newMedication.dosageForm}
                  onChange={(e) => setNewMedication({ ...newMedication, dosageForm: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select dosage form</option>
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="cream">Cream</option>
                  <option value="ointment">Ointment</option>
                  <option value="drops">Drops</option>
                </select>
              </div>
              <div>
                <label htmlFor="strength" className="block text-sm font-medium text-gray-700">
                  Strength
                </label>
                <input
                  type="text"
                  id="strength"
                  value={newMedication.strength}
                  onChange={(e) => setNewMedication({ ...newMedication, strength: e.target.value })}
                  placeholder="e.g., 500mg, 10ml"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save Medication
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medications List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {medications.map((medication, index) => {
            let medicationData;
            try {
              medicationData = JSON.parse(medication);
            } catch {
              medicationData = { name: medication };
            }
            
            return (
              <li key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{medicationData.name}</h4>
                    {medicationData.genericName && (
                      <p className="text-sm text-gray-500">Generic: {medicationData.genericName}</p>
                    )}
                    <div className="mt-1 text-sm text-gray-500">
                      {medicationData.category && <span className="mr-3">Category: {medicationData.category}</span>}
                      {medicationData.dosageForm && <span className="mr-3">Form: {medicationData.dosageForm}</span>}
                      {medicationData.strength && <span>Strength: {medicationData.strength}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const updatedMedications = [...medications];
                      updatedMedications.splice(index, 1);
                      importMedications(updatedMedications);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
          {medications.length === 0 && (
            <li className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500">No medications added yet.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
