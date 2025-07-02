// src/components/PDFPreviewPanel.tsx
import React, { useEffect, useState } from 'react';
import { Group, Select, Text, Title, Loader, Center } from '@mantine/core';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF, { InvoiceDocument } from './InvoicePDF';
import type { InvoiceData } from '../utils/InvoiceTypes';
import { pdfStyles } from '../utils/InvoicePDFStyles';

interface PDFPreviewPanelProps {
  invoiceData: InvoiceData;
  styleType: string;
  setStyleType: (style: string) => void;
}

const PDFPreviewPanel: React.FC<PDFPreviewPanelProps> = ({
  invoiceData,
  styleType,
  setStyleType,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const styleOptions = Object.keys(pdfStyles).map((key) => ({
    value: key,
    label: key.replace(/^style/, 'Style '),
  }));

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const generatePDF = async () => {
      try {
        const blob = await pdf(<InvoiceDocument data={invoiceData} styleType={styleType} />).toBlob();
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setPdfUrl(url);
        }
      } catch (err) {
        console.error('Error generating PDF:', err);
        if (isMounted) setPdfUrl(null);
      }
    };

    timeoutId = setTimeout(() => {
      generatePDF();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [invoiceData, styleType]);

  return (
    <>
      <Title order={4} ta="center">Live PDF Preview</Title>

      <Select
        label="Choose PDF Style"
        value={styleType}
        onChange={(val) => val && setStyleType(val)}
        data={styleOptions}
        mb="sm"
        w={200}
        data-testid="select-style"
      />

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="invoice-preview"
          style={{ width: '100%', height: '90vh', border: '1px solid #ccc' }}
        />
      ) : (
        <Center>
          <Loader size="sm" />
          <Text ml="sm">Generating PDF preview…</Text>
        </Center>
      )}

      <Group justify="center" mt="md">
        <InvoicePDF data={invoiceData} />
      </Group>
    </>
  );
};

export default PDFPreviewPanel;
