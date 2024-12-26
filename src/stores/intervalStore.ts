import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IntervalStore {
  intervals: string[];
  addInterval: (interval: string) => void;
  removeInterval: (interval: string) => void;
}

export const useIntervalStore = create<IntervalStore>()(
  persist(
    (set) => ({
      intervals: [
        'Once daily',
        'Twice daily',
        'Thrice daily',
        'Four times daily',
        'Every 4 hours',
        'Every 6 hours',
        'Every 8 hours',
        'Every 12 hours',
        'At bedtime',
        'Before meals',
        'After meals',
        'With meals',
        'As needed'
      ],
      addInterval: (interval) => set((state) => ({
        intervals: [...state.intervals, interval]
      })),
      removeInterval: (interval) => set((state) => ({
        intervals: state.intervals.filter((i) => i !== interval)
      })),
    }),
    {
      name: 'interval-store'
    }
  )
);
