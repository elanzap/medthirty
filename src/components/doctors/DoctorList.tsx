import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { Doctor } from '../../types';
import { DoctorForm } from './DoctorForm';
import { useDoctorStore } from '../../stores/doctorStore';
import { useGeneralSettingsStore } from '../../stores/generalSettingsStore';

export const DoctorList: React.FC = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useDoctorStore();
  const { settings } = useGeneralSettingsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (doctorData: Omit<Doctor, 'id'>) => {
    if (editingDoctor) {
      updateDoctor(editingDoctor.id, doctorData);
    } else {
      addDoctor(doctorData);
    }
    setShowForm(false);
    setEditingDoctor(null);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctor(id);
    }
  };

  return (
    <div className="space-y-6">
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
            placeholder="Search doctors..."
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </button>
      </div>

      {/* Doctor List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new doctor.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <li key={doctor.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{doctor.name}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      <p>{doctor.speciality}</p>
                      <p> {doctor.qualification}</p>
                      <p>Registration: {doctor.registrationNumber}</p>
                      <p>Consultation Fee: 
                        {settings.defaultCurrency === 'USD' && '$'}
                        {settings.defaultCurrency === 'EUR' && '€'}
                        {settings.defaultCurrency === 'GBP' && '£'}
                        {settings.defaultCurrency === 'INR' && '₹'}
                        {settings.defaultCurrency === 'JPY' && '¥'}
                        {settings.defaultCurrency === 'CAD' && 'CA$'}
                        {settings.defaultCurrency === 'AUD' && 'A$'}
                        {doctor.consultationFee}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoctor(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DoctorForm
                initialData={editingDoctor || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingDoctor(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
