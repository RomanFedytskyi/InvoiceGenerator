import type { InvoiceData } from './InvoiceTypes';

const LOCAL_STORAGE_KEY = 'invoice-form-data';

const EMPTY_INITIAL_DATA: InvoiceData = {
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

const parseDate = (d: Date | string) =>
  typeof d === 'string' ? new Date(d) : d;

export const loadInitialInvoiceData = async (): Promise<InvoiceData> => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...EMPTY_INITIAL_DATA,
        ...parsed,
        issuedDate: parseDate(parsed.issuedDate),
        dueDate: parseDate(parsed.dueDate),
      };
    }
  } catch (err) {
    console.warn('Failed to load from localStorage:', err);
  }

  try {
    const res = await fetch('../../invoice-config.json');
    if (!res.ok) throw new Error('initial-invoice.json not found');
    const data = await res.json();

    return {
      ...EMPTY_INITIAL_DATA,
      ...data,
      issuedDate: parseDate(data.issuedDate),
      dueDate: parseDate(data.dueDate),
    };
  } catch (err) {
    console.warn('No initial JSON found, using empty invoice data.');
    return EMPTY_INITIAL_DATA;
  }
};
