import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnosisTemplate } from '../types';

interface DiagnosisStore {
  diagnosisTemplates: DiagnosisTemplate[];
  diagnoses: string[];
  addDiagnosisTemplate: (template: Omit<DiagnosisTemplate, 'id'>) => void;
  updateDiagnosisTemplate: (id: string, template: Partial<DiagnosisTemplate>) => void;
  deleteDiagnosisTemplate: (id: string) => void;
  addDiagnosis: (diagnosis: string) => void;
  removeDiagnosis: (diagnosis: string) => void;
}

export const useDiagnosisStore = create<DiagnosisStore>()(
  persist(
    (set) => ({
      diagnosisTemplates: [],
      diagnoses: [
        'Hypertension',
        'Type 2 Diabetes',
        'Upper Respiratory Infection',
        'Bronchitis',
        'Gastroenteritis',
        'Migraine',
        'Arthritis',
        'Anxiety Disorder',
        'Asthma',
        'Allergic Rhinitis',
      ],
      addDiagnosisTemplate: (template) => set((state) => ({
        diagnosisTemplates: [
          ...state.diagnosisTemplates,
          {
            ...template,
            id: Math.random().toString(36).substr(2, 9)
          }
        ]
      })),
      updateDiagnosisTemplate: (id, template) => set((state) => ({
        diagnosisTemplates: state.diagnosisTemplates.map((t) =>
          t.id === id ? { ...t, ...template } : t
        )
      })),
      deleteDiagnosisTemplate: (id) => set((state) => ({
        diagnosisTemplates: state.diagnosisTemplates.filter((t) => t.id !== id)
      })),
      addDiagnosis: (diagnosis) => set((state) => ({
        diagnoses: [...state.diagnoses, diagnosis]
      })),
      removeDiagnosis: (diagnosis) => set((state) => ({
        diagnoses: state.diagnoses.filter(d => d !== diagnosis)
      })),
    }),
    {
      name: 'diagnosis-store',
      version: 1,
    }
  )
);
