import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, TestTubes, Upload, Download } from 'lucide-react';
import Papa from 'papaparse';
import type { DiagnosticTest } from '../../types';
import { DiagnosticTestForm } from './DiagnosticTestForm';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';
import { useGeneralSettingsStore } from '../../stores/generalSettingsStore';
import { generateId } from '../../utils/idGenerator';

export const DiagnosticTestList: React.FC = () => {
  const { tests, addTest, updateTest, deleteTest } = useDiagnosticTestStore();
  const { settings } = useGeneralSettingsStore();
  const [editingTest, setEditingTest] = useState<DiagnosticTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const testData = {
      name: formData.name,
      price: parseFloat(formData.price)
    };

    if (editingTest) {
      updateTest(editingTest.id, testData);
      setEditingTest(null);
    } else {
      addTest(testData);
    }

    // Reset form
    setFormData({ name: '', price: '' });
  };

  const handleEdit = (test: DiagnosticTest) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      price: test.price.toString()
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      deleteTest(id);
    }
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
        const validTests: Omit<DiagnosticTest, 'id'>[] = [];

        results.data.forEach((row: any, index: number) => {
          // Validate required fields
          if (!row.name || !row.price) {
            importErrors.push(`Row ${index + 2}: Missing required fields (name or price)`);
            return;
          }

          // Validate price is a number
          const price = parseFloat(row.price);
          if (isNaN(price) || price < 0) {
            importErrors.push(`Row ${index + 2}: Invalid price`);
            return;
          }

          validTests.push({
            name: row.name.trim(),
            price: price
          });
        });

        // Add valid tests
        validTests.forEach(test => addTest(test));

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
            placeholder="Search diagnostic tests..."
          />
        </div>
      </div>

      {/* Add/Edit Test Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="testName" className="block text-sm font-medium text-gray-700">
              Test Name
            </label>
            <input
              type="text"
              id="testName"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="testPrice" className="block text-sm font-medium text-gray-700">
              Price
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
                id="testPrice"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                min="0"
                step="0.01"
                className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {editingTest && (
            <button
              type="button"
              onClick={() => {
                setEditingTest(null);
                setFormData({ name: '', price: '' });
              }}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingTest ? 'Update Test' : 'Add Test'}
          </button>
        </div>
      </form>

      {/* CSV Import */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Import Diagnostic Tests from CSV</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <a
            href="/diagnostic-tests-template.csv"
            download
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </a>
        </div>
        {importErrors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-red-600">Import Errors:</h3>
            <ul className="list-disc pl-5 text-sm text-red-600">
              {importErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Test List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <TestTubes className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No diagnostic tests</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new diagnostic test.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {test.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {settings.defaultCurrency === 'USD' && '$'}
                    {settings.defaultCurrency === 'EUR' && '€'}
                    {settings.defaultCurrency === 'GBP' && '£'}
                    {settings.defaultCurrency === 'INR' && '₹'}
                    {settings.defaultCurrency === 'JPY' && '¥'}
                    {settings.defaultCurrency === 'CAD' && 'CA$'}
                    {settings.defaultCurrency === 'AUD' && 'A$'}
                    {test.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(test)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
