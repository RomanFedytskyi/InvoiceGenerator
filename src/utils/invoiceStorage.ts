import type { InvoiceData } from './InvoiceTypes';

const LOCAL_STORAGE_KEY = 'invoice-form-data';

export interface InvoiceSettings {
  initialValues: InvoiceData;
  useDueDays: boolean;
  dueInDays: number;
}

const EMPTY_DATA: InvoiceData = {
  companyName: '',
  invoiceNumber: '',
  issuedDate: new Date(),
  dueDate: new Date(),
  clientName: '',
  clientAddress: '',
  description: '',
  items: [{ description: '', qty: 1, price: 0 }],
  fromName: '',
  fromAddress: '',
  email: '',
  phone: '',
  bankName: '',
  bankAddress: '',
  routingNumber: '',
  accountNumber: '',
  paymentRef: '',
};

export function loadInvoiceSettings(): InvoiceSettings {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const { __extraSettings = {}, ...invoice } = parsed;
      return {
        initialValues: {
          ...EMPTY_DATA,
          ...invoice,
          issuedDate: new Date(invoice.issuedDate),
          dueDate: new Date(invoice.dueDate),
        },
        useDueDays: __extraSettings.useDueDays ?? false,
        dueInDays: __extraSettings.dueInDays ?? 30,
      };
    }
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
  }

  return {
    initialValues: EMPTY_DATA,
    useDueDays: false,
    dueInDays: 30,
  };
}

export function saveInvoiceSettings(data: InvoiceData, useDueDays: boolean, dueInDays: number): void {
  try {
    const payload = {
      ...data,
      issuedDate: data.issuedDate.toISOString(),
      dueDate: data.dueDate.toISOString(),
      __extraSettings: { useDueDays, dueInDays },
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}
