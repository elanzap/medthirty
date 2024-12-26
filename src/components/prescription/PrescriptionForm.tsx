import React, { useState } from 'react';
import { VitalSignsForm } from './VitalSignsForm';
import { DiagnosisForm } from './DiagnosisForm';
import { MedicationList } from './MedicationList';
import { LabTestList } from './LabTestList';
import { PrescriptionActions } from './PrescriptionActions';
import { usePrescription } from '../../hooks/usePrescription';
import { generateVisitId, generatePrescriptionId } from '../../utils/idGenerator';
import { useDoctorStore } from '../../stores/doctorStore';
import type { DiagnosisTemplate, Patient, Doctor } from '../../types';

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
  const { doctors } = useDoctorStore();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedConsultationType, setSelectedConsultationType] = useState<'Pay' | 'Review'>('Pay');

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
      // Add doctor details
      ...(selectedDoctor ? {
        doctorName: selectedDoctor.name,
        doctorConsultationFee: selectedConsultationType === 'Pay' ? selectedDoctor.consultationFee : 0,
        doctorConsultationFeeType: selectedConsultationType
      } : {}),
      date: new Date().toISOString(), // Add current timestamp
      status: 'completed'
    };

    console.log('Submitting prescription with patient details:', prescriptionData);
    onSubmit(prescriptionData);
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Doctor Selection */}
      <div>
        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
          Select Doctor
        </label>
        <select
          id="doctor"
          value={selectedDoctor?.id || ''}
          onChange={(e) => {
            const doctor = doctors.find(d => d.id === e.target.value);
            setSelectedDoctor(doctor || null);
            // Reset to default Pay type when doctor changes
            setSelectedConsultationType('Pay');
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.speciality}
            </option>
          ))}
        </select>

        {selectedDoctor && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                id="pay-consultation"
                name="consultation-type"
                type="radio"
                value="Pay"
                checked={selectedConsultationType === 'Pay'}
                onChange={() => setSelectedConsultationType('Pay')}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label 
                htmlFor="pay-consultation" 
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Pay Consultation (₹{selectedDoctor.consultationFee})
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="review-consultation"
                name="consultation-type"
                type="radio"
                value="Review"
                checked={selectedConsultationType === 'Review'}
                onChange={() => setSelectedConsultationType('Review')}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label 
                htmlFor="review-consultation" 
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Review Consultation (Free)
              </label>
            </div>
          </div>
        )}
      </div>

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
