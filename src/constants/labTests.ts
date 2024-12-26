import { Diagnosis } from './diagnoses';

export const LAB_TESTS_BY_DIAGNOSIS: Record<Diagnosis, string[]> = {
  'Hypertension': ['Complete Blood Count', 'Lipid Profile', 'Kidney Function Test', 'Electrolytes'],
  'Type 2 Diabetes': ['HbA1c', 'Fasting Blood Sugar', 'Lipid Profile', 'Kidney Function Test'],
  'Upper Respiratory Infection': ['Complete Blood Count', 'Throat Culture', 'Chest X-ray'],
  'Bronchitis': ['Complete Blood Count', 'Chest X-ray', 'Sputum Culture'],
  'Gastroenteritis': ['Complete Blood Count', 'Stool Culture', 'Electrolytes'],
  'Migraine': ['Complete Blood Count', 'MRI Brain', 'CT Scan Head'],
  'Arthritis': ['Complete Blood Count', 'Rheumatoid Factor', 'Anti-CCP', 'ESR', 'CRP'],
  'Anxiety Disorder': ['Thyroid Function Test', 'Complete Blood Count', 'Basic Metabolic Panel'],
  'Asthma': ['Pulmonary Function Test', 'Complete Blood Count', 'Chest X-ray'],
  'Allergic Rhinitis': ['Complete Blood Count', 'IgE Levels', 'Skin Prick Test'],
} as const;
