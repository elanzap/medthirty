import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnosticTest } from '../types';

interface DiagnosticTestStore {
  tests: DiagnosticTest[];
  addTest: (test: Omit<DiagnosticTest, 'id'>) => void;
  updateTest: (id: string, test: Partial<DiagnosticTest>) => void;
  deleteTest: (id: string) => void;
}

export const useDiagnosticTestStore = create<DiagnosticTestStore>()(
  persist(
    (set) => ({
      tests: [
        { id: '1', name: 'Complete Blood Count', price: 500 },
        { id: '2', name: 'Lipid Profile', price: 800 },
        { id: '3', name: 'Liver Function Test', price: 1000 },
        { id: '4', name: 'Kidney Function Test', price: 900 },
        { id: '5', name: 'Blood Sugar', price: 300 },
        { id: '6', name: 'Thyroid Profile', price: 1200 },
        { id: '7', name: 'Urine Analysis', price: 400 },
        { id: '8', name: 'HbA1c', price: 800 },
        { id: '9', name: 'X-Ray', price: 1000 },
        { id: '10', name: 'ECG', price: 500 },
        { id: '11', name: 'Chest X-ray', price: 1000 },
        { id: '12', name: 'Sputum Culture', price: 800 },
        { id: '13', name: 'Throat Culture', price: 600 },
        { id: '14', name: 'MRI Brain', price: 8000 },
        { id: '15', name: 'CT Scan Head', price: 5000 },
        { id: '16', name: 'Rheumatoid Factor', price: 800 },
        { id: '17', name: 'Anti-CCP', price: 1200 },
        { id: '18', name: 'ESR', price: 200 },
        { id: '19', name: 'CRP', price: 500 },
        { id: '20', name: 'IgE Levels', price: 1000 },
        { id: '21', name: 'Skin Prick Test', price: 1500 },
        { id: '22', name: 'Pulmonary Function Test', price: 2000 },
        { id: '23', name: 'Basic Metabolic Panel', price: 1000 },
        { id: '24', name: 'Electrolytes', price: 500 },
        { id: '25', name: 'Stool Culture', price: 800 },
      ],
      addTest: (test) => set((state) => ({
        tests: [...state.tests, {
          ...test,
          id: Math.random().toString(36).substr(2, 9)
        }]
      })),
      updateTest: (id, test) => set((state) => ({
        tests: state.tests.map((t) =>
          t.id === id ? { ...t, ...test } : t
        )
      })),
      deleteTest: (id) => set((state) => ({
        tests: state.tests.filter((t) => t.id !== id)
      })),
    }),
    {
      name: 'diagnostic-test-store'
    }
  )
);
