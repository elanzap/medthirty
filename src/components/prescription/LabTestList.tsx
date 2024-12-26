import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';
import { SearchableSelect } from '../common/SearchableSelect';

interface LabTestListProps {
  labTests: string[];
  onUpdate: (labTests: string[]) => void;
}

export const LabTestList: React.FC<LabTestListProps> = ({ labTests, onUpdate }) => {
  const { tests: diagnosticTests } = useDiagnosticTestStore();
  const [newLabTest, setNewLabTest] = useState('');

  const handleRemoveLabTest = (testToRemove: string) => {
    onUpdate(labTests.filter(test => test !== testToRemove));
  };

  const handleAddLabTest = () => {
    if (newLabTest && !labTests.includes(newLabTest)) {
      onUpdate([...labTests, newLabTest]);
      setNewLabTest('');
    }
  };

  const labTestOptions = diagnosticTests.map(test => ({
    value: test.name,
    label: test.name
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Recommended Lab Tests</h3>
      <ul className="space-y-2">
        {labTests.map((test, index) => (
          <li 
            key={index} 
            className="flex items-center justify-between text-sm text-gray-700"
          >
            <span>{test}</span>
            <button
              type="button"
              onClick={() => handleRemoveLabTest(test)}
              className="text-red-600 hover:text-red-900"
              title="Remove lab test"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center space-x-4">
        <div className="flex-grow">
          <SearchableSelect
            options={labTestOptions}
            value={newLabTest}
            onChange={setNewLabTest}
            placeholder="Search and select additional lab test..."
          />
        </div>
        <button
          type="button"
          onClick={handleAddLabTest}
          disabled={!newLabTest}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Test
        </button>
      </div>
    </div>
  );
};
