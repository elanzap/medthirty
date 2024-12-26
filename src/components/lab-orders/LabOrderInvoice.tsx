import React, { useState } from 'react';
import { Plus, Printer, X, List, Search, Trash2 } from 'lucide-react';
import type { Prescription, LabInvoice } from '../../types';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';
import { useLabInvoiceStore } from '../../stores/labInvoiceStore';
import { useGlobalSettingsStore } from '../../stores/globalSettingsStore';
import { LabInvoiceList } from './LabInvoiceList';
import { generateLabInvoicePDF } from '../../utils/pdfGenerator';

interface LabOrderInvoiceProps {
  prescriptions: Prescription[];
}

export const LabOrderInvoice: React.FC<LabOrderInvoiceProps> = ({ prescriptions }) => {
  const { tests: diagnosticTests } = useDiagnosticTestStore();
  const { addInvoice } = useLabInvoiceStore();
  const [view, setView] = useState<'list' | 'search' | 'create' | 'invoice'>('list');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [patientName, setPatientName] = useState('');

  // Get test price
  const getTestPrice = (testName: string): number => {
    const test = diagnosticTests.find(t => t.name === testName);
    return test?.price || 0;
  };

  // Calculate totals
  const calculateTotal = (tests: string[]) => {
    return tests.reduce((total, test) => total + getTestPrice(test), 0);
  };

  const calculateDiscountedTotal = (tests: string[], discountPercentage: number) => {
    const total = calculateTotal(tests);
    const discountAmount = (total * discountPercentage) / 100;
    return total - discountAmount;
  };

  // Function to delete a test
  const handleDeleteTest = (testToDelete: string) => {
    setSelectedTests(prevTests => 
      prevTests.filter(test => test !== testToDelete)
    );
  };

  // Function to add a new test
  const handleAddTest = (newTest: string) => {
    // Prevent duplicate tests
    if (!selectedTests.includes(newTest)) {
      setSelectedTests(prevTests => [...prevTests, newTest]);
    }
  };

  // Render selected tests for create view
  const renderSearchSelectedTests = () => {
    const currentTests = selectedTests;
    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-semibold mb-2 flex justify-between items-center">
          <span>Selected Tests</span>
          <span className="text-sm text-gray-600">
            Total: ₹{calculateTotal(currentTests)}
          </span>
        </h3>
        {currentTests.length === 0 ? (
          <p className="text-gray-500">No tests selected</p>
        ) : (
          <div className="space-y-2">
            {currentTests.map((test) => {
              const testDetails = diagnosticTests.find(dt => dt.name === test);
              return (
                <div 
                  key={test} 
                  className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                >
                  <div className="flex-grow">
                    <span>{test}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ₹{testDetails?.price || 0}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTest(test)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove Test"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render available tests to add in create view
  const renderSearchAvailableTests = () => {
    // Get tests that are not already selected
    const availableTests = diagnosticTests
      .filter(test => !selectedTests.includes(test.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Add New Test</h3>
        <div className="flex space-x-2">
          <select
            value=""
            onChange={(e) => handleAddTest(e.target.value)}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a test to add</option>
            {availableTests.map((test) => (
              <option key={test.name} value={test.name}>
                {test.name} - ₹{test.price}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Render invoice summary for create view
  const renderInvoiceSummary = () => {
    // Calculate totals
    const subtotal = calculateTotal(selectedTests);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;

    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-semibold mb-2">Invoice Summary</h3>
        
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          
          {/* Discount */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-red-600">- ₹{discountAmount.toFixed(2)}</span>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-green-600">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Handle test selection
  const handleTestSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const testName = e.target.value;
    if (testName && !selectedTests.includes(testName)) {
      setSelectedTests(prev => [...prev, testName]);
    }
  };

  // Handle test removal
  const handleRemoveTest = (testName: string) => {
    setSelectedTests(prev => prev.filter(test => test !== testName));
  };

  // Handle create order
  const handleCreateManualOrder = () => {
    if (!patientName.trim()) {
      alert('Please enter patient name');
      return;
    }
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    const manualPrescription: Prescription = {
      prescriptionId: 'M' + Date.now(),
      visitId: 'MV' + Date.now(),
      patientId: 'MP' + Date.now(),
      patientName: patientName.trim(),
      date: new Date().toISOString(),
      labTests: selectedTests
    };

    setSelectedPrescription(manualPrescription);
    setView('invoice');
  };

  // Handle save and print
  const handleSave = async () => {
    console.log('handleSave called');
    console.log('Selected Prescription:', selectedPrescription);
    console.log('Selected Tests:', selectedTests);
    console.log('Discount:', discount);

    if (!selectedPrescription && selectedTests.length === 0) {
      console.error('No prescription or tests selected');
      return;
    }

    const { labName, labLogo } = useGlobalSettingsStore.getState();

    // Determine the tests to use
    const testsToInvoice = selectedPrescription 
      ? selectedPrescription.labTests || []  // Use modified prescription tests
      : selectedTests;  // Or use manually selected tests

    // Calculate totals
    const subtotal = calculateTotal(testsToInvoice);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;

    const invoice: LabInvoice = {
      id: `INV${Date.now()}`,
      date: new Date().toISOString(),
      prescriptionId: selectedPrescription?.prescriptionId,
      patientName: selectedPrescription?.patientName || patientName,
      tests: testsToInvoice,
      subtotal,
      discount,
      total,
      status: 'saved',
      labName,
      labLogo
    };

    console.log('Invoice to be saved:', invoice);

    try {
      // Add invoice to store
      addInvoice(invoice);
      console.log('Invoice added to store');

      // Generate and open PDF
      await generateLabInvoicePDF(invoice, diagnosticTests);
      console.log('PDF generated and opened');

      // Reset form and switch to list view
      resetForm();
      setView('list');
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setSelectedPrescription(null);
    setSelectedTests([]);
    setPatientName('');
    setDiscount(0);
  };

  // Render selected tests for search view with delete option
  const renderSearchSelectedTestsSearchView = () => {
    // Use prescription tests or manually selected tests
    const currentTests = selectedPrescription?.labTests || [];

    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-semibold mb-2 flex justify-between items-center">
          <span>Selected Tests</span>
          <span className="text-sm text-gray-600">
            Total: ₹{calculateTotal(currentTests)}
          </span>
        </h3>
        {currentTests.length === 0 ? (
          <p className="text-gray-500">No tests selected</p>
        ) : (
          <div className="space-y-2">
            {currentTests.map((test) => (
              <div 
                key={test} 
                className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
              >
                <div className="flex-grow">
                  <span>{test}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ₹{getTestPrice(test)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Remove test from prescription's lab tests
                    if (selectedPrescription) {
                      const updatedTests = selectedPrescription.labTests.filter(t => t !== test);
                      setSelectedPrescription(prev => prev ? {
                        ...prev,
                        labTests: updatedTests
                      } : null);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                  title="Remove Test"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render available tests to add in search view
  const renderSearchAvailableTestsSearchView = () => {
    // Get tests that are not already selected
    const currentTests = selectedPrescription?.labTests || [];
    const availableTests = diagnosticTests
      .filter(test => !currentTests.includes(test.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Add New Test</h3>
        <div className="flex space-x-2">
          <select
            value=""
            onChange={(e) => {
              const newTest = e.target.value;
              // Add test to prescription's lab tests
              if (selectedPrescription) {
                setSelectedPrescription(prev => prev ? {
                  ...prev,
                  labTests: [...(prev.labTests || []), newTest]
                } : null);
              }
            }}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select a test to add</option>
            {availableTests.map((test) => (
              <option key={test.name} value={test.name}>
                {test.name} - ₹{test.price}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Render invoice summary for search view
  const renderInvoiceSummarySearchView = () => {
    // Use prescription tests or manually selected tests
    const currentTests = selectedPrescription?.labTests || [];
    
    // Calculate totals
    const subtotal = calculateTotal(currentTests);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;

    return (
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-semibold mb-2">Invoice Summary</h3>
        
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          
          {/* Discount */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-red-600">- ₹{discountAmount.toFixed(2)}</span>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total</span>
            <span className="text-lg font-bold text-green-600">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Handle prescription search
  const handleSearch = () => {
    const foundPrescription = prescriptions.find(
      (p) => p.prescriptionId === prescriptionId
    );

    if (foundPrescription) {
      // Ensure labTests exists and is an array
      const labTests = foundPrescription.labTests || [];
      
      // Update selectedPrescription with labTests
      setSelectedPrescription({
        ...foundPrescription,
        labTests: labTests
      });
      
      // Force a re-render by updating state
      setView('search');
    } else {
      alert('Prescription not found');
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <List className="h-5 w-5 mr-2 inline" />
            List
          </button>
          <button
            onClick={() => setView('search')}
            className={`px-4 py-2 rounded-md ${view === 'search' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <Search className="h-5 w-5 mr-2 inline" />
            Search
          </button>
          <button
            onClick={() => setView('create')}
            className={`px-4 py-2 rounded-md ${view === 'create' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <Plus className="h-5 w-5 mr-2 inline" />
            Create
          </button>
        </div>
      </div>

      {/* Create Manual Order View */}
      {view === 'create' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {/* Patient Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {renderSearchSelectedTests()}
            {renderSearchAvailableTests()}
            {renderInvoiceSummary()}

            {/* Save & Print Button */}
            <div className="flex justify-end mt-6">
              <div className="flex items-center space-x-4">
                {/* Discount Input */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Save & Print Button */}
                <button
                  onClick={handleSave}
                  disabled={selectedTests.length === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white font-semibold transition-colors duration-300 ${
                    selectedTests.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }`}
                >
                  <Printer className="h-5 w-5" />
                  <span>Save & Print Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice View */}
      {view === 'invoice' && selectedPrescription && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Lab Invoice</h2>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Invoice Summary */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-medium">{selectedPrescription.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prescription ID</p>
                  <p className="font-medium">{selectedPrescription.prescriptionId}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Selected Tests</h3>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-4 py-2">Test</th>
                      <th className="text-right px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescription.labTests?.map((test) => (
                      <tr key={test} className="border-b">
                        <td className="px-4 py-2">{test}</td>
                        <td className="px-4 py-2 text-right">₹{getTestPrice(test)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="px-4 py-2">Subtotal</td>
                      <td className="px-4 py-2 text-right">₹{calculateTotal(selectedPrescription.labTests || [])}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="px-4 py-2">Discount ({discount}%)</td>
                      <td className="px-4 py-2 text-right">
                        -₹{((calculateTotal(selectedPrescription.labTests || []) * discount) / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="font-bold text-lg">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2 text-right">
                        ₹{calculateDiscountedTotal(selectedPrescription.labTests || [], discount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Save & Print Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Printer className="h-5 w-5 mr-2" />
                Save & Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <LabInvoiceList 
          invoices={useLabInvoiceStore.getState().invoices} 
          onViewInvoice={(invoice) => {
            console.log('View Invoice:', invoice);
          }} 
        />
      )}

      {/* Search View */}
      {view === 'search' && (
        <div>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Enter Prescription ID"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Search className="h-5 w-5 mr-2 inline" />
              Search
            </button>
          </div>

          {selectedPrescription && (
            <div>
              {renderSearchSelectedTestsSearchView()}
              {renderSearchAvailableTestsSearchView()}
              {renderInvoiceSummarySearchView()}
              
              {/* Save & Print Invoice Button */}
              <div className="flex justify-end mt-6">
                <div className="flex items-center space-x-4">
                  {/* Discount Input */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Save & Print Button */}
                  <button
                    onClick={handleSave}
                    disabled={!selectedPrescription || (selectedPrescription.labTests || []).length === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white font-semibold transition-colors duration-300 ${
                      !selectedPrescription || (selectedPrescription.labTests || []).length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  >
                    <Printer className="h-5 w-5" />
                    <span>Save & Print Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
