import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DosageStore {
  dosages: string[];
  addDosage: (dosage: string) => void;
  removeDosage: (dosage: string) => void;
}

export const useDosageStore = create<DosageStore>()(
  persist(
    (set) => ({
      dosages: [
        '1 Tablet',
        '1/2 Tablet',
        '1/4 Tablet',
        '2 Tablets',
        '3 Tablets',
        '5ml',
        '10ml',
        '15ml',
        '20ml',
        '25ml',
        '30ml',
        '1 Capsule',
        '2 Capsules',
        '1 Teaspoon',
        '2 Teaspoons',
        '1 Tablespoon',
        '2 Drops',
        '3 Drops',
        '4 Drops',
        '1 Puff',
        '2 Puffs'
      ],
      addDosage: (dosage) => set((state) => ({
        dosages: [...state.dosages, dosage]
      })),
      removeDosage: (dosage) => set((state) => ({
        dosages: state.dosages.filter((d) => d !== dosage)
      })),
    }),
    {
      name: 'dosage-store'
    }
  )
);
