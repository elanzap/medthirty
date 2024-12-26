import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LabInvoice } from '../types';

interface LabInvoiceStore {
  invoices: LabInvoice[];
  addInvoice: (invoice: LabInvoice) => void;
  updateInvoice: (id: string, status: 'saved' | 'printed') => void;
}

export const useLabInvoiceStore = create<LabInvoiceStore>()(
  persist(
    (set) => ({
      invoices: [],
      addInvoice: (invoice) => set((state) => ({
        invoices: [...state.invoices, invoice]
      })),
      updateInvoice: (id, status) => set((state) => ({
        invoices: state.invoices.map(invoice =>
          invoice.id === id ? { ...invoice, status } : invoice
        )
      })),
    }),
    {
      name: 'lab-invoice-store'
    }
  )
);
