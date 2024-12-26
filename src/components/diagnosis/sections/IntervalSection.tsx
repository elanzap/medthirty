import React from 'react';
import { ItemManagement } from '../ItemManagement';
import { useDiagnosisStore } from '../../../stores/diagnosisStore';

export const IntervalSection: React.FC = () => {
  const { intervals, addInterval, importIntervals } = useDiagnosisStore();

  return (
    <ItemManagement
      title="Interval"
      items={intervals}
      onAddItem={addInterval}
      onImportCSV={importIntervals}
    />
  );
};
