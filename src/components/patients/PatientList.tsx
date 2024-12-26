import React, { useState, useMemo } from 'react';
import type { Patient, Prescription } from '../../types';
import { User, FileText, Search, History, Plus } from 'lucide-react';
import { PatientDetails } from './PatientDetails';
import { NewPatientForm } from './NewPatientForm';

interface PatientListProps {
  patients: Patient[];
  prescriptions: Prescription[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: (patient: Omit<Patient, 'id'>) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  prescriptions,
  onSelectPatient,
  onAddPatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<Patient | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.phoneNumber.includes(searchTerm) ||
        patient.patientId?.toLowerCase().includes(searchTerm) ||
        patient.age.toString().includes(searchTerm)
      );
    });
  }, [patients, searchQuery]);

  const handleAddPatient = (patientData: Omit<Patient, 'id'>) => {
    onAddPatient(patientData);
    setShowNewPatientForm(false);
  };

  const handleNewPrescription = (patient: Patient) => {
    onSelectPatient(patient);
  };

  const handleViewHistory = (patient: Patient) => {
    try {
      const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
      console.log('Patient prescriptions:', patientPrescriptions); // Debug log
      setSelectedPatientForDetails(patient);
    } catch (error) {
      console.error('Error viewing patient history:', error);
      alert('Error viewing patient history. Please try again.');
    }
  };

  if (selectedPatientForDetails) {
    try {
      const patientPrescriptions = prescriptions.filter(p => p.patientId === selectedPatientForDetails.id);
      return (
        <PatientDetails
          patient={selectedPatientForDetails}
          prescriptions={patientPrescriptions}
          onBack={() => setSelectedPatientForDetails(null)}
          onNewPrescription={handleNewPrescription}
        />
      );
    } catch (error) {
      console.error('Error rendering patient details:', error);
      return (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading patient history. Please try again.</p>
          <button
            onClick={() => setSelectedPatientForDetails(null)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Patients
          </button>
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by name, ID, phone, or age..."
          />
        </div>
        <button
          onClick={() => setShowNewPatientForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding a new patient'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowNewPatientForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => {
              const prescriptionCount = prescriptions.filter(p => p.patientId === patient.id).length;
              
              return (
                <li
                  key={patient.id}
                  className="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-indigo-600">
                            {patient.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({patient.patientId})
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {patient.age} years • {patient.gender} • {patient.phoneNumber}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Total Prescriptions: {prescriptionCount}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-3">
                      <button
                        onClick={() => handleViewHistory(patient)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <History className="h-4 w-4 mr-2" />
                        History
                      </button>
                      <button
                        onClick={() => handleNewPrescription(patient)}
                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        New Prescription
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showNewPatientForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Add New Patient</h3>
                <button
                  onClick={() => setShowNewPatientForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <NewPatientForm onSubmit={handleAddPatient} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
