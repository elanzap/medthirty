import { Diagnosis } from './diagnoses';
import type { Medication } from '../types';

export const MEDICATIONS_BY_DIAGNOSIS: Record<Diagnosis, Medication[]> = {
  'Hypertension': [
    { name: 'Amlodipine', dosage: '5mg', interval: 'Once daily', duration: '30 days', instructions: 'Take with or without food' },
    { name: 'Lisinopril', dosage: '10mg', interval: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
  ],
  'Type 2 Diabetes': [
    { name: 'Metformin', dosage: '500mg', interval: 'Twice daily', duration: '30 days', instructions: 'Take with meals' },
    { name: 'Glimepiride', dosage: '2mg', interval: 'Once daily', duration: '30 days', instructions: 'Take with breakfast' },
  ],
  'Upper Respiratory Infection': [
    { name: 'Amoxicillin', dosage: '500mg', interval: 'Three times daily', duration: '7 days', instructions: 'Take with food' },
    { name: 'Acetaminophen', dosage: '500mg', interval: 'Every 6 hours as needed', duration: '5 days', instructions: 'For fever and pain' },
  ],
  'Bronchitis': [
    { name: 'Azithromycin', dosage: '500mg', interval: 'Once daily', duration: '5 days', instructions: 'Take 1 hour before or 2 hours after meals' },
    { name: 'Dextromethorphan', dosage: '20mg', interval: 'Every 4-6 hours as needed', duration: '7 days', instructions: 'For cough' },
  ],
  'Gastroenteritis': [
    { name: 'Ondansetron', dosage: '4mg', interval: 'Every 8 hours as needed', duration: '3 days', instructions: 'For nausea and vomiting' },
    { name: 'Oral Rehydration Solution', dosage: '200ml', interval: 'After each loose stool', duration: '3 days', instructions: 'Maintain hydration' },
  ],
  'Migraine': [
    { name: 'Sumatriptan', dosage: '50mg', interval: 'As needed', duration: '30 days', instructions: 'Take at first sign of migraine' },
    { name: 'Ibuprofen', dosage: '400mg', interval: 'Every 6 hours as needed', duration: '30 days', instructions: 'Take with food' },
  ],
  'Arthritis': [
    { name: 'Naproxen', dosage: '500mg', interval: 'Twice daily', duration: '30 days', instructions: 'Take with food' },
    { name: 'Celecoxib', dosage: '200mg', interval: 'Once daily', duration: '30 days', instructions: 'Take with or without food' },
  ],
  'Anxiety Disorder': [
    { name: 'Sertraline', dosage: '50mg', interval: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
    { name: 'Alprazolam', dosage: '0.25mg', interval: 'Twice daily as needed', duration: '14 days', instructions: 'Take for acute anxiety' },
  ],
  'Asthma': [
    { name: 'Albuterol Inhaler', dosage: '2 puffs', interval: 'Every 4-6 hours as needed', duration: '30 days', instructions: 'For shortness of breath' },
    { name: 'Fluticasone Inhaler', dosage: '2 puffs', interval: 'Twice daily', duration: '30 days', instructions: 'Maintenance inhaler' },
  ],
  'Allergic Rhinitis': [
    { name: 'Cetirizine', dosage: '10mg', interval: 'Once daily', duration: '30 days', instructions: 'Take in the evening' },
    { name: 'Fluticasone Nasal Spray', dosage: '1 spray per nostril', interval: 'Twice daily', duration: '30 days', instructions: 'Use regularly for best results' },
  ],
} as const;
