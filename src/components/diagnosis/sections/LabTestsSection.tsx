import React from 'react';
import { LabTestManager } from '../../lab-tests/LabTestManager';

export const LabTestsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Lab Tests Management</h2>
      <LabTestManager />
    </div>
  );
};
