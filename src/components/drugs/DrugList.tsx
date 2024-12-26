import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, Download } from 'lucide-react';
import Papa from 'papaparse';
import { useDrugStore } from '../../stores/drugStore';
import type { Drug } from '../../types';

export const DrugList: React.FC = () => {
  const { drugs, addDrug, updateDrug, deleteDrug } = useDrugStore();
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    strength: '',
    genericName: '',
  });

  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drug.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const drugData = {
      name: formData.name,
      type: formData.type,
      strength: formData.strength,
      genericName: formData.genericName || undefined,
    };

    if (editingDrug) {
      updateDrug(editingDrug.id, drugData);
      setEditingDrug(null);
    } else {
      addDrug(drugData);
    }

    // Reset form
    setFormData({
      name: '',
      type: '',
      strength: '',
      genericName: '',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this drug?')) {
      deleteDrug(id);
    }
  };

  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    setFormData({
      name: drug.name,
      type: drug.type,
      strength: drug.strength,
      genericName: drug.genericName || '',
    });
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset import errors
    setImportErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importErrors: string[] = [];
        const validDrugs: Omit<Drug, 'id'>[] = [];

        results.data.forEach((row: any, index: number) => {
          // Validate required fields
          if (!row.name) {
            importErrors.push(`Row ${index + 2}: Drug name is required`);
            return;
          }

          validDrugs.push({
            name: row.name.trim(),
            type: row.type?.trim() || '',
            strength: row.strength?.trim() || '',
            genericName: row.genericName?.trim() || undefined,
          });
        });

        // Add valid drugs
        validDrugs.forEach(drug => addDrug(drug));

        // Show any import errors
        if (importErrors.length > 0) {
          setImportErrors(importErrors);
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setImportErrors(['Error parsing CSV file']);
      }
    });
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ['name', 'type', 'strength', 'genericName'],
      ['Paracetamol', 'Tablet', '500mg', 'Acetaminophen'],
      ['Amoxicillin', 'Capsule', '250mg', 'Amoxicillin'],
      ['Ibuprofen', 'Tablet', '400mg', 'Ibuprofen'],
      ['Metformin', 'Tablet', '500mg', 'Metformin'],
      ['Aspirin', 'Tablet', '100mg', 'Acetylsalicylic acid']
    ];

    const csvContent = templateData.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'drugs-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search drugs..."
          />
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            className="hidden"
            id="import-csv"
          />
          <label
            htmlFor="import-csv"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </label>
        </div>
      </div>

      {importErrors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <ul>
            {importErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Add/Edit Drug Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Paracetamol"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Tablet"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="strength" className="block text-sm font-medium text-gray-700">
                  Strength
                </label>
                <input
                  type="text"
                  id="strength"
                  value={formData.strength}
                  onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  placeholder="e.g., 500mg"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="genericName" className="block text-sm font-medium text-gray-700">
                  Generic Name
                </label>
                <input
                  type="text"
                  id="genericName"
                  value={formData.genericName}
                  onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  placeholder="e.g., Acetaminophen"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            {editingDrug && (
              <button
                type="button"
                onClick={() => {
                  setEditingDrug(null);
                  setFormData({
                    name: '',
                    type: '',
                    strength: '',
                    genericName: '',
                  });
                }}
                className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingDrug ? 'Update' : 'Add'} Drug
            </button>
          </div>
        </div>
      </form>

      {/* Drug List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strength
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generic Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrugs.map((drug) => (
              <tr key={drug.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {drug.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drug.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drug.strength}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drug.genericName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(drug)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(drug.id)}
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
    </div>
  );
};
