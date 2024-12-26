import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';
import { useDurationStore } from '../../stores/durationStore';
import { useIntervalStore } from '../../stores/intervalStore';
import { useDosageStore } from '../../stores/dosageStore';
import { useDrugStore } from '../../stores/drugStore';
import { SearchableSelect } from '../common/SearchableSelect';
import type { DiagnosisTemplate, Medication } from '../../types';

interface DiagnosisTemplateFormProps {
  templateId?: string | null;
  onClose?: () => void;
  className?: string;
}

export const DiagnosisTemplateForm: React.FC<DiagnosisTemplateFormProps> = ({
  templateId,
  onClose,
  className,
}) => {
  const { diagnosisTemplates, addDiagnosisTemplate, updateDiagnosisTemplate } = useDiagnosisStore();
  const { tests: diagnosticTests } = useDiagnosticTestStore();
  const { durations } = useDurationStore();
  const { intervals } = useIntervalStore();
  const { dosages } = useDosageStore();
  const { drugs } = useDrugStore();

  const [formData, setFormData] = useState<{
    name: string;
    medications: Medication[];
    labTests: string[];
  }>({
    name: '',
    medications: [{ name: '', dosage: '', interval: '', duration: '', instructions: '' }],
    labTests: [''],
  });

  useEffect(() => {
    if (templateId) {
      const template = diagnosisTemplates.find(t => t.id === templateId);
      if (template) {
        setFormData({
          name: template.name,
          medications: template.medications,
          labTests: template.labTests,
        });
      }
    }
  }, [templateId, diagnosisTemplates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...formData,
        medications: formData.medications.filter(med => med.name.trim()),
        labTests: formData.labTests.filter(test => test.trim()),
      };

      if (templateId) {
        updateDiagnosisTemplate(templateId, cleanedData);
      } else {
        addDiagnosisTemplate(cleanedData);
      }
      onClose?.();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('There was an error saving the template. Please try again.');
    }
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', interval: '', duration: '', instructions: '' }],
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const addLabTest = () => {
    setFormData(prev => ({
      ...prev,
      labTests: [...prev.labTests, ''],
    }));
  };

  const removeLabTest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      labTests: prev.labTests.filter((_, i) => i !== index),
    }));
  };

  const updateLabTest = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      labTests: prev.labTests.map((test, i) =>
        i === index ? value : test
      ),
    }));
  };

  const getDrugDisplayName = (drug: any) => {
    return `${drug.type}. ${drug.name} ${drug.strength}`;
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {templateId ? 'Edit' : 'Add'} Template
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700">Medications</h4>
            <button
              type="button"
              onClick={addMedication}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Medication
            </button>
          </div>
          <div className="space-y-4">
            {formData.medications.map((med, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <SearchableSelect
                      label="Drug"
                      options={drugs.map(drug => ({
                        value: getDrugDisplayName(drug),
                        label: getDrugDisplayName(drug)
                      }))}
                      value={med.name}
                      onChange={(value) => updateMedication(index, 'name', value)}
                      placeholder="Select drug..."
                      required
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Dosage"
                      options={dosages.map(dosage => ({
                        value: dosage,
                        label: dosage
                      }))}
                      value={med.dosage}
                      onChange={(value) => updateMedication(index, 'dosage', value)}
                      placeholder="Select dosage..."
                      required
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Interval"
                      options={intervals.map(interval => ({
                        value: interval,
                        label: interval
                      }))}
                      value={med.interval}
                      onChange={(value) => updateMedication(index, 'interval', value)}
                      placeholder="Select interval..."
                      required
                    />
                  </div>
                  <div>
                    <SearchableSelect
                      label="Duration"
                      options={durations.map(duration => ({
                        value: duration,
                        label: duration
                      }))}
                      value={med.duration}
                      onChange={(value) => updateMedication(index, 'duration', value)}
                      placeholder="Select duration..."
                      required
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="e.g., Take after meals"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700">Lab Tests</h4>
            <button
              type="button"
              onClick={addLabTest}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Lab Test
            </button>
          </div>
          <div className="space-y-2">
            {formData.labTests.map((test, index) => (
              <div key={index} className="flex items-center space-x-2 w-full">
                <SearchableSelect
                  className="flex-grow"
                  options={diagnosticTests.map(test => ({
                    value: test.name,
                    label: test.name
                  }))}
                  value={test}
                  onChange={(value) => updateLabTest(index, value)}
                  placeholder="Select a lab test..."
                  required
                />
                <button
                  type="button"
                  onClick={() => removeLabTest(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {templateId ? 'Update' : 'Save'} Template
          </button>
        </div>
      </form>
    </div>
  );
};
