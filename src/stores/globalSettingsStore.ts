import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalSettings {
  // Clinic Details
  clinicName: string;
  clinicPhone: string;
  clinicAddress: string;
  clinicEmail: string;
  clinicWebsite: string;
  clinicLogo: string;
  clinicBanner: string;

  // Lab Details
  labName: string;
  labPhone: string;
  labAddress: string;
  labEmail: string;
  labWebsite: string;
  labLogo: string;
  labBanner: string;

  // Pharmacy Details
  pharmacyName: string;
  pharmacyPhone: string;
  pharmacyAddress: string;
  pharmacyEmail: string;
  pharmacyWebsite: string;
  pharmacyLogo: string;
  pharmacyBanner: string;

  // Currency
  currency: string;

  // Update methods
  updateClinicSettings: (settings: Partial<Pick<GlobalSettings, 
    'clinicName' | 'clinicPhone' | 'clinicAddress' | 'clinicEmail' | 'clinicWebsite' | 'clinicLogo' | 'clinicBanner'>>) => void;
  
  updateLabSettings: (settings: Partial<Pick<GlobalSettings, 
    'labName' | 'labPhone' | 'labAddress' | 'labEmail' | 'labWebsite' | 'labLogo' | 'labBanner'>>) => void;
  
  updatePharmacySettings: (settings: Partial<Pick<GlobalSettings, 
    'pharmacyName' | 'pharmacyPhone' | 'pharmacyAddress' | 'pharmacyEmail' | 'pharmacyWebsite' | 'pharmacyLogo' | 'pharmacyBanner'>>) => void;
  
  updateCurrency: (currency: string) => void;
}

export const useGlobalSettingsStore = create<GlobalSettings>()(
  persist(
    (set) => ({
      // Default values
      clinicName: '',
      clinicPhone: '',
      clinicAddress: '',
      clinicEmail: '',
      clinicWebsite: '',
      clinicLogo: '',
      clinicBanner: '',

      labName: '',
      labPhone: '',
      labAddress: '',
      labEmail: '',
      labWebsite: '',
      labLogo: '',
      labBanner: '',

      pharmacyName: '',
      pharmacyPhone: '',
      pharmacyAddress: '',
      pharmacyEmail: '',
      pharmacyWebsite: '',
      pharmacyLogo: '',
      pharmacyBanner: '',

      currency: 'INR',

      // Update methods
      updateClinicSettings: (settings) => set(state => ({
        ...state,
        ...settings
      })),

      updateLabSettings: (settings) => set(state => ({
        ...state,
        ...settings
      })),

      updatePharmacySettings: (settings) => set(state => ({
        ...state,
        ...settings
      })),

      updateCurrency: (currency) => set(state => ({
        ...state,
        currency
      }))
    }),
    {
      name: 'global-settings-storage',
      partialize: (state) => ({
        clinicName: state.clinicName,
        clinicPhone: state.clinicPhone,
        clinicAddress: state.clinicAddress,
        clinicEmail: state.clinicEmail,
        clinicWebsite: state.clinicWebsite,
        clinicLogo: state.clinicLogo,
        clinicBanner: state.clinicBanner,

        labName: state.labName,
        labPhone: state.labPhone,
        labAddress: state.labAddress,
        labEmail: state.labEmail,
        labWebsite: state.labWebsite,
        labLogo: state.labLogo,
        labBanner: state.labBanner,

        pharmacyName: state.pharmacyName,
        pharmacyPhone: state.pharmacyPhone,
        pharmacyAddress: state.pharmacyAddress,
        pharmacyEmail: state.pharmacyEmail,
        pharmacyWebsite: state.pharmacyWebsite,
        pharmacyLogo: state.pharmacyLogo,
        pharmacyBanner: state.pharmacyBanner,

        currency: state.currency
      })
    }
  )
);

export const getGlobalSettings = () => {
  const state = useGlobalSettingsStore.getState();
  return {
    clinicName: state.clinicName || 'Medical Clinic',
    clinicAddress: state.clinicAddress || 'Address Not Available',
    clinicPhone: state.clinicPhone || 'Contact Not Available',
    clinicLogo: state.clinicLogo || '',
    clinicEmail: state.clinicEmail || '',
    clinicWebsite: state.clinicWebsite || ''
  };
};
