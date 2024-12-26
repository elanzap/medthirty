import React from 'react';
import { ItemManagement } from '../ItemManagement';
import { useDiagnosisStore } from '../../../stores/diagnosisStore';

export const DosageSection: React.FC = () => {
  const { dosages, addDosage, importDosages } = useDiagnosisStore();

  return (
    <ItemManagement
      title="Dosage"
      items={dosages}
      onAddItem={addDosage}
      onImportCSV={importDosages}
    />
  );
};
