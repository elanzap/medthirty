import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Drug } from '../types';

interface DrugStore {
  drugs: Drug[];
  addDrug: (drug: Omit<Drug, 'id'>) => void;
  updateDrug: (id: string, drug: Partial<Drug>) => void;
  deleteDrug: (id: string) => void;
}

export const useDrugStore = create<DrugStore>()(
  persist(
    (set) => ({
      drugs: [
        {
          id: '1',
          name: 'Azithromycin',
          type: 'Tablet',
          strength: '500mg',
          company: 'Cipla',
          genericName: 'Azithromycin'
        },
        {
          id: '2',
          name: 'Dolo',
          type: 'Tablet',
          strength: '650mg',
          company: 'Micro Labs',
          genericName: 'Paracetamol'
        },
        // Add more default drugs as needed
      ],
      addDrug: (drug) => set((state) => ({
        drugs: [...state.drugs, { ...drug, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateDrug: (id, updatedDrug) => set((state) => ({
        drugs: state.drugs.map((drug) => 
          drug.id === id ? { ...drug, ...updatedDrug } : drug
        )
      })),
      deleteDrug: (id) => set((state) => ({
        drugs: state.drugs.filter((drug) => drug.id !== id)
      })),
    }),
    {
      name: 'drug-store'
    }
  )
);
