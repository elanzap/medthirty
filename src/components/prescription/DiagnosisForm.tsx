import React from 'react';
import { X } from 'lucide-react';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { SearchableSelect } from '../common/SearchableSelect';
import type { DiagnosisTemplate } from '../../types';

interface DiagnosisFormProps {
  value: string[];
  onChange: (diagnoses: string[]) => void;
  onTemplateSelect?: (template: DiagnosisTemplate) => void;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ 
  value, 
  onChange,
  onTemplateSelect 
}) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState('');
  const { diagnosisTemplates } = useDiagnosisStore();

  const handleAdd = () => {
    if (!selectedDiagnosis) return;

    // Check if a template was selected
    const selectedTemplate = diagnosisTemplates.find(t => t.id === selectedDiagnosis);
    
    if (selectedTemplate) {
      // If it's a template, add the template name and trigger template selection
      if (!value.includes(selectedTemplate.name)) {
        onChange([...value, selectedTemplate.name]);
        if (onTemplateSelect) {
          onTemplateSelect(selectedTemplate);
        }
      }
    }
    setSelectedDiagnosis('');
  };

  const handleRemove = (diagnosisToRemove: string) => {
    onChange(value.filter(d => d !== diagnosisToRemove));
  };

  // Prepare options for SearchableSelect
  const templateOptions = diagnosisTemplates
    .filter(template => !value.includes(template.name))
    .map(template => ({
      value: template.id,
      label: `${template.name} (Template)`
    }));

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Diagnoses
      </label>
      
      <div className="flex gap-2">
        <SearchableSelect
          label="Select Diagnosis Template"
          options={templateOptions}
          value={selectedDiagnosis}
          onChange={setSelectedDiagnosis}
          placeholder="Search diagnosis templates..."
          className="flex-grow"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedDiagnosis}
          className="shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Diagnoses:</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((diagnosis) => (
              <span
                key={diagnosis}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {diagnosis}
                {diagnosisTemplates.some(t => t.name === diagnosis) && (
                  <span className="ml-1 text-xs text-indigo-600">(Template)</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(diagnosis)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
