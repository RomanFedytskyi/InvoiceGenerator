export interface LineItem {
  description: string;
  qty: number;
  price: number;
}

export interface InvoiceData {
  companyName: string;
  invoiceNumber: string;
  issuedDate: Date;
  dueDate: Date;
  clientName: string;
  clientAddress: string;
  description: string;
  items: LineItem[];
  fromName: string;
  fromAddress: string;
  email: string;
  phone: string;
  bankName: string;
  bankAddress: string;
  routingNumber: string;
  accountNumber: string;
  paymentRef: string;
}
