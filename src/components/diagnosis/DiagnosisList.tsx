import React from 'react';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import type { CustomDiagnosis } from '../../types';

interface DiagnosisListProps {
  diagnoses: CustomDiagnosis[];
  onEdit: (diagnosis: CustomDiagnosis) => void;
  onDelete: (id: string) => void;
}

export const DiagnosisList: React.FC<DiagnosisListProps> = ({
  diagnoses,
  onEdit,
  onDelete,
}) => {
  if (diagnoses.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No custom diagnoses</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new diagnosis configuration.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {diagnoses.map((diagnosis) => (
        <li key={diagnosis.id} className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{diagnosis.name}</h4>
              <p className="text-sm text-gray-500">
                {diagnosis.medications.length} medication{diagnosis.medications.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(diagnosis)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDelete(diagnosis.id)}
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
