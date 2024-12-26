import React from 'react';
import { Upload } from 'lucide-react';

interface LabTestImportProps {
  onImport: (tests: string[]) => void;
}

export const LabTestImport: React.FC<LabTestImportProps> = ({ onImport }) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const tests = text.split('\n')
          .map(line => line.trim())
          .filter(Boolean);
        onImport(tests);
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-t border-gray-200">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Import from CSV</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload a CSV file with one test per line
        </p>
      </div>
      <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
        <Upload className="h-4 w-4 mr-2" />
        Choose File
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="sr-only"
        />
      </label>
    </div>
  );
};
