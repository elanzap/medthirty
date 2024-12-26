import React, { useState, useRef, useMemo } from 'react';
import { Plus, Edit2, Trash2, Upload, FileDown, Search } from 'lucide-react';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { DiagnosisTemplateForm } from './DiagnosisTemplateForm';
import type { DiagnosisTemplate } from '../../types';

export const DiagnosisManager: React.FC = () => {
  const { diagnosisTemplates, deleteDiagnosisTemplate, addDiagnosisTemplate } = useDiagnosisStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return diagnosisTemplates;

    const lowercaseQuery = searchQuery.toLowerCase().trim();

    return diagnosisTemplates.filter(template => 
      // Search in template name
      template.name.toLowerCase().includes(lowercaseQuery) ||
      
      // Search in medications
      template.medications.some(med => 
        med.name.toLowerCase().includes(lowercaseQuery) ||
        med.dosage.toLowerCase().includes(lowercaseQuery) ||
        med.interval.toLowerCase().includes(lowercaseQuery) ||
        med.duration.toLowerCase().includes(lowercaseQuery) ||
        med.instructions.toLowerCase().includes(lowercaseQuery)
      ) ||
      
      // Search in lab tests
      template.labTests.some(test => 
        test.toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [diagnosisTemplates, searchQuery]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteDiagnosisTemplate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

      // Group templates by name
      const templateMap = new Map<string, DiagnosisTemplate>();

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
        
        // Skip empty lines
        if (values.length < headers.length || !values[0]) continue;

        const [
          templateName, 
          drugName, 
          dosage, 
          interval, 
          duration, 
          instructions, 
          labTests
        ] = values;

        // If template doesn't exist, create it
        if (!templateMap.has(templateName)) {
          templateMap.set(templateName, {
            id: crypto.randomUUID(),
            name: templateName,
            medications: [],
            labTests: labTests ? labTests.split(';') : []
          });
        }

        // Add medication if drug name is provided
        if (drugName) {
          const template = templateMap.get(templateName)!;
          template.medications.push({
            name: drugName,
            dosage: dosage || '',
            interval: interval || '',
            duration: duration || '',
            instructions: instructions || ''
          });
        }
      }

      // Add all templates
      templateMap.forEach(template => {
        addDiagnosisTemplate(template);
      });

      alert(`Imported ${templateMap.size} templates successfully!`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadSampleTemplate = () => {
    const sampleCSV = `Template Name,Drug Name,Dosage,Interval,Duration,Instructions,Lab Tests
Fever Treatment,Paracetamol,500mg,Every 6 hours,3 days,Take with water,CBC;Typhoid
Fever Treatment,Ibuprofen,400mg,Every 8 hours,2 days,Take after meals,Widal Test
Hypertension Management,Lisinopril,10mg,Once daily,Ongoing,Take in the morning,Lipid Profile
Diabetes Care,Metformin,500mg,Twice daily,Ongoing,Take with meals,HbA1c;Fasting Glucose
Respiratory Infection,Azithromycin,250mg,Once daily,5 days,Take on an empty stomach,Chest X-Ray`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'diagnosis_template_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Diagnosis Templates</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </button>
          <button
            onClick={triggerFileInput}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </button>
          <button
            onClick={downloadSampleTemplate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download Sample Template
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            className="hidden"
          />
        </div>
      </div>

      {(showForm || editingTemplate) && (
        <div className="bg-white rounded-lg shadow-xl p-6">
          <DiagnosisTemplateForm
            templateId={editingTemplate}
            onClose={handleCloseForm}
            className="w-full"
          />
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Search Templates</h4>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by template name, drug, or lab test..."
              />
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <div className="text-sm text-gray-500">
                  No templates match your search "{searchQuery}"
                </div>
              ) : (
                <div className="text-sm text-gray-500">No templates added yet</div>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </button>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTemplate(template.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit template"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {template.medications.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700">Medications:</h5>
                    <ul className="mt-1 space-y-1">
                      {template.medications.map((med, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {med.name} - {med.dosage} ({med.interval} for {med.duration})
                          {med.instructions && (
                            <div className="ml-4 text-xs text-gray-500">
                              Instructions: {med.instructions}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {template.labTests.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700">Lab Tests:</h5>
                    <ul className="mt-1 list-disc list-inside">
                      {template.labTests.map((test, index) => (
                        <li key={index} className="text-sm text-gray-600">{test}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
