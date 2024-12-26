import React, { useState } from 'react';
import { useLabInvoiceStore } from '../../stores/labInvoiceStore';
import { useGlobalSettingsStore } from '../../stores/globalSettingsStore';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';
import { Search, Eye, Printer } from 'lucide-react';
import type { LabInvoice } from '../../types';
import { generateLabInvoicePDF } from '../../utils/pdfGenerator';

interface LabInvoiceListProps {
  invoices?: LabInvoice[];
  onViewInvoice?: (invoice: LabInvoice) => void;
}

export const LabInvoiceList: React.FC<LabInvoiceListProps> = ({ 
  invoices: propInvoices, 
  onViewInvoice 
}) => {
  const { invoices: storeInvoices, updateInvoice } = useLabInvoiceStore();
  const { labName, labLogo } = useGlobalSettingsStore();
  const { tests: diagnosticTests } = useDiagnosticTestStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Use prop invoices if provided, otherwise use store invoices
  const invoices = propInvoices || storeInvoices;

  console.log('All Invoices:', invoices);

  const filteredInvoices = invoices
    .filter(invoice => {
      // Ensure invoice has all required properties
      if (!invoice || !invoice.patientName || !invoice.id) return false;

      return (
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.prescriptionId && invoice.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log('Filtered Invoices:', filteredInvoices);

  // Handle view invoice
  const handleViewInvoice = async (invoice: LabInvoice) => {
    console.log('Viewing Invoice:', invoice);
    try {
      await generateLabInvoicePDF(invoice, diagnosticTests);
      
      // Optional: Update invoice status to 'printed'
      updateInvoice(invoice.id, 'printed');
    } catch (error) {
      console.error('Error viewing invoice:', error);
      alert('Failed to open invoice PDF');
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'printed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Printed
          </span>
        );
      case 'saved':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Saved
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const renderActionButtons = (invoice: LabInvoice) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleViewInvoice(invoice)}
        className="text-indigo-600 hover:text-indigo-900"
        title="View Invoice"
      >
        <Eye className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lab Invoices</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-3 text-gray-400 h-4 w-4" />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No invoices found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatus(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {renderActionButtons(invoice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
