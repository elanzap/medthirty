import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { PatientList } from './components/patients/PatientList';
import { PrescriptionForm } from './components/prescription/PrescriptionForm';
import { PrescriptionList } from './components/prescription/PrescriptionList';
import { DiagnosisManager } from './components/diagnosis/DiagnosisManager';
import { DoctorList } from './components/doctors/DoctorList';
import { Settings } from './components/settings/Settings';
import { DiagnosticTestList } from './components/diagnostic-tests/DiagnosticTestList';
import { DoseDurationManager } from './components/duration/DoseDurationManager';
import { DoseIntervalManager } from './components/interval/DoseIntervalManager';
import { DosageManager } from './components/dosage/DosageManager';
import { DrugList } from './components/drugs/DrugList';
import { LabOrderInvoice } from './components/lab-orders/LabOrderInvoice';
import { GeneralSettings } from './components/settings/GeneralSettings';
import { GlobalSettings } from './components/settings/GlobalSettings';
import type { Patient, Prescription } from './types';
import { loadPatients, savePatients, loadPrescriptions, savePrescriptions } from './utils/storage';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const savedPatients = loadPatients();
    const savedPrescriptions = loadPrescriptions();
    if (savedPatients?.length > 0) {
      setPatients(savedPatients);
    }
    if (savedPrescriptions?.length > 0) {
      setPrescriptions(savedPrescriptions);
    }
  }, []);

  useEffect(() => {
    if (patients?.length > 0) {
      savePatients(patients);
    }
  }, [patients]);

  useEffect(() => {
    if (prescriptions?.length > 0) {
      savePrescriptions(prescriptions);
    }
  }, [prescriptions]);

  const handleAddPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPatients(prev => [...(prev || []), newPatient]);
  };

  const handlePrescriptionSubmit = (prescriptionData: Partial<Prescription>) => {
    console.error('PRESCRIPTION SUBMISSION:', {
      prescriptionData,
      selectedPatient
    });

    if (!selectedPatient) return;

    const finalPrescriptionData: Partial<Prescription> = {
      ...prescriptionData,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      gender: selectedPatient.gender,
      age: selectedPatient.age ? selectedPatient.age.toString() : undefined,
      phone: selectedPatient.phoneNumber,
      patient: {
        ...selectedPatient,
        age: selectedPatient.age ? selectedPatient.age.toString() : undefined
      }
    };

    console.error('FINAL PRESCRIPTION DATA:', finalPrescriptionData);

    const newPrescription = {
      ...finalPrescriptionData,
      date: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    } as Prescription;

    const updatedPrescriptions = [...prescriptions, newPrescription];
    setPrescriptions(updatedPrescriptions);
    savePrescriptions(updatedPrescriptions);

    // Generate PDF
    // generatePrescriptionPDF(newPrescription);

    // Reset selection
    setSelectedPatient(null);
    setActiveSection('prescriptions');
  };

  const handleUpdatePrescription = (index: number, updatedPrescription: Partial<Prescription>) => {
    setPrescriptions(prev => {
      if (!prev) return [updatedPrescription as Prescription];
      const newPrescriptions = [...prev];
      const patient = patients?.find(p => p.id === updatedPrescription.patientId);
      newPrescriptions[index] = {
        ...newPrescriptions[index],
        ...updatedPrescription,
        patientName: patient?.name || newPrescriptions[index].patientName
      };
      return newPrescriptions;
    });
  };

  const renderContent = () => {
    if (selectedPatient) {
      return (
        <>
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                New Prescription for {selectedPatient.name}
              </h2>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Patients
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <PrescriptionForm
              patientId={selectedPatient.id}
              patient={selectedPatient}
              onSubmit={handlePrescriptionSubmit}
            />
          </div>
        </>
      );
    }

    switch (activeSection) {
      case 'patients':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Patients
            </h2>
            <PatientList
              patients={patients || []}
              prescriptions={prescriptions || []}
              onSelectPatient={setSelectedPatient}
              onAddPatient={handleAddPatient}
            />
          </div>
        );
      
      case 'prescriptions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Prescriptions
            </h2>
            <div className="bg-white rounded-lg shadow p-6">
              <PrescriptionList 
                prescriptions={prescriptions || []}
                onUpdatePrescription={handleUpdatePrescription}
                patients={patients || []}
              />
            </div>
          </div>
        );

      case 'lab-orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Lab Orders
            </h2>
            <LabOrderInvoice prescriptions={prescriptions || []} />
          </div>
        );

      case 'general-settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              General Settings
            </h2>
            <GeneralSettings />
          </div>
        );

      case 'global-settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Global Settings
            </h2>
            <GlobalSettings />
          </div>
        );

      case 'doctors':
        return <DoctorList />;
      
      case 'diagnoses':
        return <DiagnosisManager />;
      
      case 'diagnostic-tests':
        return <DiagnosticTestList />;
      
      case 'drugs':
        return <DrugList />;
      
      case 'dose-duration':
        return <DoseDurationManager />;
      
      case 'dose-interval':
        return <DoseIntervalManager />;
      
      case 'dosage':
        return <DosageManager />;
      
      case 'settings':
        return <Settings />;
      
      default:
        return null;
    }
  };

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
