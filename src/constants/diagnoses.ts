export const DIAGNOSES = [
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
] as const;

export type Diagnosis = typeof DIAGNOSES[number];
