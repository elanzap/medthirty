import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Doctor } from '../types';

interface DoctorStore {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
}

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set) => ({
      doctors: [],
      addDoctor: (doctor) => set((state) => ({
        doctors: [...state.doctors, {
          ...doctor,
          id: Math.random().toString(36).substr(2, 9)
        }]
      })),
      updateDoctor: (id, doctor) => set((state) => ({
        doctors: state.doctors.map((d) =>
          d.id === id ? { ...d, ...doctor } : d
        )
      })),
      deleteDoctor: (id) => set((state) => ({
        doctors: state.doctors.filter((d) => d.id !== id)
      })),
    }),
    {
      name: 'doctor-store'
    }
  )
);
