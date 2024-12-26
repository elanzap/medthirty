import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface LabTestFormProps {
  onSubmit: (labTest: string) => void;
}

export const LabTestForm: React.FC<LabTestFormProps> = ({ onSubmit }) => {
  const [testName, setTestName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testName.trim()) {
      onSubmit(testName.trim());
      setTestName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-2">
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Enter lab test name"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Test
        </button>
      </div>
    </form>
  );
};
