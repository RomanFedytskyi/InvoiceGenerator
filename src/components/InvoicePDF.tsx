import React from 'react';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
} from '@react-pdf/renderer';
import type { InvoiceData } from '../utils/InvoiceTypes';
import { pdfStyles, type StyleType } from '../utils/InvoicePDFStyles';
import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { format } from 'date-fns';
import { formatMoney } from '../utils/formatting';

export interface InvoiceDocumentProps {
  data: InvoiceData;
  styleType?: StyleType;
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ data, styleType = 'style1' }) => {
  const total = data.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const styles = pdfStyles[styleType];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice</Text>
        <Text style={styles.subHeader}>
          {data.companyName} — INVOICE #{data.invoiceNumber}
        </Text>
        <Text>
          <Text>
            Issued: {format(new Date(data.issuedDate), 'MM/dd/yyyy')} | Due: {format(new Date(data.dueDate), 'MM/dd/yyyy')}
          </Text>

        </Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.block}>
              <Text style={styles.subHeader}>FROM:</Text>
              <Text>{data.fromName}</Text>
              <Text>{data.phone}</Text>
              <Text>{data.email}</Text>
              <Text>{data.fromAddress}</Text>
            </View>
            <View style={styles.block}>
              <Text style={styles.subHeader}>BILL TO:</Text>
              <Text>{data.clientName}</Text>
              <Text>{data.clientAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
            <Text style={[styles.cell, styles.boldCell]}>Description</Text>
            <Text style={[styles.cell, styles.boldCell, styles.rightCell]}>QTY</Text>
            <Text style={[styles.cell, styles.boldCell, styles.rightCell]}>Price</Text>
            <Text style={[styles.cell, styles.boldCell, styles.rightCell]}>Amount</Text>
          </View>
          {Array.isArray(data.items) && data.items.length > 0 ? (
            data.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{item.description || '—'}</Text>
                <Text style={[styles.cell, styles.rightCell]}>{item.qty ?? 0}</Text>
                <Text style={[styles.cell, styles.rightCell]}>
                  {formatMoney(item.price)}
                </Text>
                <Text style={[styles.cell, styles.rightCell]}>
                  {formatMoney((item.qty ?? 0) * (item.price ?? 0))}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.cell}>—</Text>
              <Text style={[styles.cell, styles.rightCell]}>1</Text>
              <Text style={[styles.cell, styles.rightCell]}>$0.00</Text>
              <Text style={[styles.cell, styles.rightCell]}>$0.00</Text>
            </View>
          )}
        </View>

        <Text style={styles.totalSection}>Total: {formatMoney(total)}</Text>

        <View style={styles.paymentDetails}>
          <Text style={styles.subHeader}>Payment Instructions (Wire Transfer)</Text>
          <Text>
            <Text style={styles.label}>Bank Name:</Text> {data.bankName}
          </Text>
          <Text>
            <Text style={styles.label}>Bank Address:</Text> {data.bankAddress}
          </Text>
          <Text>
            <Text style={styles.label}>ABA/Routing Number:</Text> {data.routingNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Account Number:</Text> {data.accountNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Payment Reference:</Text> {data.paymentRef}
          </Text>
        </View>
      </Page>
    </Document>
  );
};


const InvoicePDF: React.FC<{ data: InvoiceData }> = ({ data }) => {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument data={data} />}
      fileName={`Invoice_${data.invoiceNumber}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button
          variant="filled"
          color="blue"
          rightSection={<IconDownload size={16} />}
          disabled={loading}
        >
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default InvoicePDF;
