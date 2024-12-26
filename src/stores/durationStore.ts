import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DurationStore {
  durations: string[];
  addDuration: (duration: string) => void;
  removeDuration: (duration: string) => void;
}

export const useDurationStore = create<DurationStore>()(
  persist(
    (set) => ({
      durations: [
        '1 day',
        '2 days',
        '3 days',
        '5 days',
        '7 days',
        '10 days',
        '14 days',
        '1 month',
        '2 months',
        '3 months'
      ],
      addDuration: (duration) => set((state) => ({
        durations: [...state.durations, duration]
      })),
      removeDuration: (duration) => set((state) => ({
        durations: state.durations.filter((d) => d !== duration)
      })),
    }),
    {
      name: 'duration-store'
    }
  )
);
