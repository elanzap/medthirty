import React from 'react';
import { TestTube, Trash2 } from 'lucide-react';

interface LabTestListProps {
  tests: string[];
  onDelete: (index: number) => void;
}

export const LabTestList: React.FC<LabTestListProps> = ({ tests, onDelete }) => {
  if (tests.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <TestTube className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No lab tests</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add a new lab test or import from CSV
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Lab Tests ({tests.length})</h3>
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
        {tests.map((test, index) => (
          <li key={index} className="flex items-center justify-between py-2 px-4 hover:bg-gray-50">
            <div className="flex items-center">
              <TestTube className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{test}</span>
            </div>
            <button
              onClick={() => onDelete(index)}
              className="text-red-600 hover:text-red-800"
              title="Delete test"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
