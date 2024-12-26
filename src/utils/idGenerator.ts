// Store the counters in localStorage
const STORAGE_KEYS = {
  PATIENT_COUNTER: 'patientCounter',
  VISIT_COUNTER: 'visitCounter',
  PRESCRIPTION_COUNTER: 'prescriptionCounter'
} as const;

// Initialize counters if they don't exist
const initializeCounters = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENT_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.PATIENT_COUNTER, '0');
  }
  if (!localStorage.getItem(STORAGE_KEYS.VISIT_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.VISIT_COUNTER, '0');
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTION_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTION_COUNTER, '0');
  }
};

// Initialize counters when the file is loaded
initializeCounters();

const getNextId = (counterKey: string): number => {
  const currentCounter = parseInt(localStorage.getItem(counterKey) || '0', 10);
  const nextCounter = currentCounter + 1;
  localStorage.setItem(counterKey, nextCounter.toString());
  return nextCounter;
};

export const generatePatientId = (): string => {
  const number = getNextId(STORAGE_KEYS.PATIENT_COUNTER);
  return `P${number}`;
};

export const generateVisitId = (): string => {
  const number = getNextId(STORAGE_KEYS.VISIT_COUNTER);
  return `V${number}`;
};

export const generatePrescriptionId = (): string => {
  const number = getNextId(STORAGE_KEYS.PRESCRIPTION_COUNTER);
  return `R${number}`;
};

// Function to reset all counters (useful for testing or resetting the system)
export const resetCounters = () => {
  localStorage.setItem(STORAGE_KEYS.PATIENT_COUNTER, '0');
  localStorage.setItem(STORAGE_KEYS.VISIT_COUNTER, '0');
  localStorage.setItem(STORAGE_KEYS.PRESCRIPTION_COUNTER, '0');
};
