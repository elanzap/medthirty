import React from 'react';
import { LabTestForm } from './LabTestForm';
import { LabTestImport } from './LabTestImport';
import { LabTestList } from './LabTestList';
import { useDiagnosisStore } from '../../stores/diagnosisStore';

export const LabTestManager: React.FC = () => {
  const { labTests, addLabTest, importLabTests, removeLabTest } = useDiagnosisStore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Lab Tests Management</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Add New Lab Test</h3>
            <LabTestForm onSubmit={addLabTest} />
          </div>

          <div>
            <LabTestImport onImport={importLabTests} />
          </div>

          <div>
            <LabTestList tests={labTests} onDelete={removeLabTest} />
          </div>
        </div>
      </div>
    </div>
  );
};
