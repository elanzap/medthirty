import React, { useState } from 'react';
import { VitalSignsForm } from './VitalSignsForm';
import { DiagnosisForm } from './DiagnosisForm';
import { MedicationList } from './MedicationList';
import { LabTestList } from './LabTestList';
import { PrescriptionActions } from './PrescriptionActions';
import { usePrescription } from '../../hooks/usePrescription';
import { generateVisitId, generatePrescriptionId } from '../../utils/idGenerator';
import type { DiagnosisTemplate, Patient } from '../../types';

interface PrescriptionFormProps {
  patientId: string;
  patient: Patient;
  onSubmit: (prescriptionData: any) => void;
  initialData?: any;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
  patientId, 
  patient,
  onSubmit,
  initialData 
}) => {
  const [ids] = useState(() => ({
    visitId: initialData?.visitId || generateVisitId(),
    prescriptionId: initialData?.prescriptionId || generatePrescriptionId()
  }));
  
  const { 
    prescription, 
    updateVitalSigns, 
    updateSymptoms, 
    updateDiagnoses,
    updateMedications,
    updateLabTests
  } = usePrescription(
    patientId,
    {
      ...initialData,
      visitId: ids.visitId,
      prescriptionId: ids.prescriptionId,
      patientId,
      patientName: patient.name,
      gender: patient.gender,
      age: patient.age.toString(),
      phone: patient.phoneNumber,
      patient: {
        ...patient,
        age: patient.age.toString()
      }
    }
  );

  const handleTemplateSelect = (template: DiagnosisTemplate) => {
    const currentMedications = prescription.medications || [];
    const newMedications = [...currentMedications, ...template.medications];
    updateMedications(newMedications);

    const currentLabTests = prescription.labTests || [];
    const newLabTests = Array.from(new Set([...currentLabTests, ...template.labTests]));
    updateLabTests(newLabTests);
  };

  const handleSubmit = (data: any) => {
    // Ensure all patient details are included in the submission
    const prescriptionData = {
      ...data,
      visitId: ids.visitId,
      prescriptionId: ids.prescriptionId,
      patientId: patient.id,
      patientName: patient.name,
      gender: patient.gender,
      age: patient.age.toString(),
      phone: patient.phoneNumber,
      patient: {
        ...patient,
        age: patient.age.toString()
      },
      date: new Date().toISOString(), // Add current timestamp
      status: 'completed'
    };

    console.log('Submitting prescription with patient details:', prescriptionData);
    onSubmit(prescriptionData);
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Rest of the form components remain the same */}
      <div className="bg-gray-50 px-4 py-2 rounded-md grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 font-semibold">Visit ID: <span className="font-normal">{ids.visitId}</span></p>
          <p className="text-sm text-gray-600 font-semibold">Prescription ID: <span className="font-normal">{ids.prescriptionId}</span></p>
          <p className="text-sm text-gray-600 font-semibold">Patient: <span className="font-normal">{patient.name}</span></p>
          <p className="text-sm text-gray-600 font-semibold">Patient ID: <span className="font-normal">{patient.patientId}</span></p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Age: <span className="font-normal">{patient.age} years</span></p>
          <p className="text-sm text-gray-600 font-semibold">Gender: <span className="font-normal">{patient.gender}</span></p>
          <p className="text-sm text-gray-600 font-semibold">Phone: <span className="font-normal">{patient.phoneNumber}</span></p>
        </div>
      </div>

      <VitalSignsForm
        value={prescription.vitalSigns || {}}
        onChange={updateVitalSigns}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Symptoms</label>
        <textarea
          value={prescription.symptoms || ''}
          onChange={(e) => updateSymptoms(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <DiagnosisForm
        value={prescription.diagnoses || []}
        onChange={updateDiagnoses}
        onTemplateSelect={handleTemplateSelect}
      />

      {prescription.medications !== undefined && (
        <MedicationList 
          medications={prescription.medications} 
          onUpdate={updateMedications}
        />
      )}

      {prescription.labTests && prescription.labTests.length > 0 && (
        <LabTestList 
          labTests={prescription.labTests} 
          onUpdate={updateLabTests} 
        />
      )}

      <PrescriptionActions
        prescription={{
          ...prescription,
          patientId: patient.id,
          patientName: patient.name,
          gender: patient.gender,
          age: patient.age.toString(),
          phone: patient.phoneNumber,
          patient: {
            ...patient,
            age: patient.age.toString()
          }
        }}
        onSave={handleSubmit}
      />
    </form>
  );
};
