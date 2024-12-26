import type { Prescription } from '../types';

export const formatPrescriptionDetails = (prescription: Partial<Prescription>) => {
  const formatMedication = (med: any) => 
    `${med.name} ${med.dosage}\n` +
    `Interval: ${med.interval}\n` +
    `Duration: ${med.duration}\n` +
    `Instructions: ${med.instructions}`;

  return {
    'Date': new Date(prescription.date || '').toLocaleDateString(),
    'Vital Signs': [
      `Blood Pressure: ${prescription.vitalSigns?.bloodPressure}`,
      `Pulse Rate: ${prescription.vitalSigns?.pulseRate} bpm`,
      `Temperature: ${prescription.vitalSigns?.temperature}°F`,
      `Weight: ${prescription.vitalSigns?.weight} kg`,
    ].join('\n'),
    'Symptoms': prescription.symptoms || 'None recorded',
    'Diagnoses': prescription.diagnoses?.join(', ') || 'None recorded',
    'Medications': prescription.medications?.map(formatMedication).join('\n\n') || 'None prescribed',
    'Lab Tests': prescription.labTests?.join('\n') || 'None ordered',
  };
};
