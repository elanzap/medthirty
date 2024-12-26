export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
}

export interface Prescription {
  id?: string;
  prescriptionId: string;
  visitId: string;
  patientId: string;
  patientName: string;
  date: string;
  vitalSigns?: VitalSigns;
  symptoms?: string;
  findings?: string;
  diagnoses?: string[];
  medications?: Medication[];
  labTests?: string[];
  advice?: string;
  // Additional fields for prescription
  gender?: string;
  age?: string;
  bloodGroup?: string;
  knownAllergies?: string;
  phone?: string;
  email?: string;
  pdfUrl?: string; // New field to store PDF URL
  pdfBlob?: Blob; // New field to store PDF Blob
}

export interface VitalSigns {
  bloodPressure: string;
  pulseRate: number;
  temperature: number;
  weight: number;
}

export interface Medication {
  name: string;
  dosage: string;
  interval: string;
  duration: string;
  instructions: string;
}

export interface DiagnosisTemplate {
  id: string;
  name: string;
  medications: Medication[];
  labTests: string[];
}

export interface DiagnosticTest {
  id: string;
  name: string;
  price: number;
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  qualification: string;
  registrationNumber: string;
  consultationFee: number;
}

export interface Drug {
  id: string;
  name: string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Cream' | 'Gel' | 'Ointment';
  strength: string;
  genericName?: string;
}

export interface LabInvoice {
  id: string;
  date: string;
  prescriptionId: string | null;
  patientName: string;
  tests: string[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'saved' | 'printed';
  // Optional lab details
  labName?: string;
  labLogo?: string;
}

export interface GeneralSettings {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  clinicWebsite: string;
  clinicLogo: string;
  clinicBanner: string;
  clinicTimings: {
    [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  labName: string;
  pharmacyName: string;
}
