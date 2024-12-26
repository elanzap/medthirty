import React from 'react';
import { FileText } from 'lucide-react';
import type { Patient, Prescription } from '../../types';
import { PrescriptionItem } from './PrescriptionItem';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  patients: Patient[];
  onUpdatePrescription: (index: number, prescription: Partial<Prescription>) => void;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  patients,
  onUpdatePrescription,
}) => {
  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new prescription for a patient.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {prescriptions.map((prescription, index) => (
            <PrescriptionItem
              key={prescription.prescriptionId || index}
              prescription={prescription}
              patient={patients.find(p => p.id === prescription.patientId)}
              onEdit={(updatedPrescription) => onUpdatePrescription(index, updatedPrescription)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
