import { useState, useEffect, useCallback } from 'react';
import type { Prescription, VitalSigns, Medication } from '../types';

export const usePrescription = (patientId: string, initialData?: Partial<Prescription>) => {
  const [prescription, setPrescription] = useState<Partial<Prescription>>({
    patientId,
    date: new Date().toISOString(),
    diagnoses: [],
    medications: [],
    labTests: [],
    // Include all patient details from initial data
    patientName: initialData?.patientName,
    gender: initialData?.gender,
    age: initialData?.age,
    phone: initialData?.phone,
    patient: initialData?.patient,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setPrescription(prev => ({
        ...prev,
        ...initialData,
        // Ensure patient details are preserved
        patientName: initialData.patientName || prev.patientName,
        gender: initialData.gender || prev.gender,
        age: initialData.age || prev.age,
        phone: initialData.phone || prev.phone,
        patient: initialData.patient || prev.patient
      }));
    }
  }, [initialData?.prescriptionId]);

  const updateVitalSigns = useCallback((vitalSigns: VitalSigns) => {
    setPrescription(prev => ({ ...prev, vitalSigns }));
  }, []);

  const updateSymptoms = useCallback((symptoms: string) => {
    setPrescription(prev => ({ ...prev, symptoms }));
  }, []);

  const updateDiagnoses = useCallback((diagnoses: string[]) => {
    setPrescription(prev => ({ ...prev, diagnoses }));
  }, []);

  const updateMedications = useCallback((medications: Medication[]) => {
    setPrescription(prev => ({ ...prev, medications }));
  }, []);

  const updateLabTests = useCallback((labTests: string[]) => {
    setPrescription(prev => ({ ...prev, labTests }));
  }, []);

  return {
    prescription,
    updateVitalSigns,
    updateSymptoms,
    updateDiagnoses,
    updateMedications,
    updateLabTests,
  };
};
