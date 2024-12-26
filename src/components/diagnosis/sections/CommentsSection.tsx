import React from 'react';
import { ItemManagement } from '../ItemManagement';
import { useDiagnosisStore } from '../../../stores/diagnosisStore';

export const CommentsSection: React.FC = () => {
  const { comments, addComment, importComments } = useDiagnosisStore();

  return (
    <ItemManagement
      title="Comment"
      items={comments}
      onAddItem={addComment}
      onImportCSV={importComments}
    />
  );
};
