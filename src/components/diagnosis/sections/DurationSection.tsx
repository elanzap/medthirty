import React from 'react';
import { ItemManagement } from '../ItemManagement';
import { useDiagnosisStore } from '../../../stores/diagnosisStore';

export const DurationSection: React.FC = () => {
  const { durations, addDuration, importDurations } = useDiagnosisStore();

  return (
    <ItemManagement
      title="Duration"
      items={durations}
      onAddItem={addDuration}
      onImportCSV={importDurations}
    />
  );
};
