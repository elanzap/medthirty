import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClinicTimings {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

interface GeneralSettings {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  clinicWebsite: string;
  clinicLogo: string;
  clinicBanner: string;
  clinicTimings: ClinicTimings;
  labName: string;
  pharmacyName: string;
  defaultCurrency: string;
}

interface GeneralSettingsStore {
  settings: GeneralSettings;
  updateSettings: (settings: Partial<GeneralSettings>) => void;
}

const defaultTimings = {
  open: '09:00',
  close: '18:00',
  closed: false,
};

const initialSettings: GeneralSettings = {
  clinicName: '',
  clinicAddress: '',
  clinicPhone: '',
  clinicEmail: '',
  clinicWebsite: '',
  clinicLogo: '',
  clinicBanner: '',
  clinicTimings: {
    monday: { ...defaultTimings },
    tuesday: { ...defaultTimings },
    wednesday: { ...defaultTimings },
    thursday: { ...defaultTimings },
    friday: { ...defaultTimings },
    saturday: { ...defaultTimings },
    sunday: { ...defaultTimings, closed: true },
  },
  labName: '',
  pharmacyName: '',
  defaultCurrency: '',
};

export const useGeneralSettingsStore = create<GeneralSettingsStore>()(
  persist(
    (set) => ({
      settings: initialSettings,
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
    }),
    {
      name: 'general-settings-store',
      version: 1,
    }
  )
);
