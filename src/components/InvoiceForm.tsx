import React, { useMemo, useEffect, useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import {
  Group,
  Title,
  Grid,
  Container,
  Text,
  Accordion,
  Select,
} from '@mantine/core';
import { pdf } from '@react-pdf/renderer';

import InvoicePDF, { InvoiceDocument } from './InvoicePDF';
import type { InvoiceData } from '../utils/InvoiceTypes';
import { pdfStyles } from '../utils/InvoicePDFStyles';
import { addDays } from 'date-fns';
import { loadInvoiceSettings, saveInvoiceSettings } from '../utils/invoiceStorage';
import GeneralSection from './Form/GeneralSection';
import FromSection from './Form/FromSection';
import ToSection from './Form/ToSection';
import ItemsSection from './Form/ItemsSection';
import PaymentSection from './Form/PaymentSection';
import PDFPreviewPanel from './PDFPreviewPanel';

const formatDate = (date: Date | string): string =>
  typeof date === 'string' ? date : date.toISOString().split('T')[0];

const { initialValues, useDueDays: savedUseDueDays, dueInDays: savedDueInDays } = loadInvoiceSettings();

const InvoiceForm: React.FC = () => {
  const formik = useFormik<InvoiceData>({
    initialValues,
    validationSchema: Yup.object({
      invoiceNumber: Yup.string().required(),
      issuedDate: Yup.date().required(),
      dueDate: Yup.date().required(),
    }),
    onSubmit: () => { },
  });

  const [debouncedValues, setDebouncedValues] = useState(formik.values);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [opened, setOpened] = useState<string[]>(['general']);
  const [useDueDays, setUseDueDays] = useState(savedUseDueDays);
  const [dueInDays, setDueInDays] = useState<number>(savedDueInDays);

  const styleOptions = Object.keys(pdfStyles).map((key) => ({
    value: key,
    label: key.replace(/^style/, 'Style '), // e.g., style1 → Style 1
  }));

  const [styleType, setStyleType] = useState(styleOptions[0].value);

  useEffect(() => {
    if (useDueDays && formik.values.issuedDate) {
      const issued = new Date(formik.values.issuedDate);
      const due = addDays(issued, dueInDays);
      formik.setFieldValue('dueDate', due);
    }
  }, [useDueDays, dueInDays, formik.values.issuedDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValues({ ...formik.values });
    }, 200);
    return () => clearTimeout(timeout);
  }, [formik.values]);

  useEffect(() => {
    saveInvoiceSettings(formik.values, useDueDays, dueInDays);
  }, [formik.values, useDueDays, dueInDays]);

  const sanitizedData: InvoiceData = useMemo(() => {
    let items = (formik.values.items || []).filter(
      (item) =>
        item &&
        typeof item.qty === 'number' &&
        typeof item.price === 'number' &&
        !isNaN(item.qty) &&
        !isNaN(item.price)
    );

    if (items.length === 0) {
      items = [{ description: '—', qty: 1, price: 0 }];
    }

    return {
      ...formik.values,
      ...debouncedValues,
      issuedDate: formatDate(formik.values.issuedDate),
      dueDate: formatDate(formik.values.dueDate),
      items,
    };
  }, [formik.values, debouncedValues]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const generatePDF = async () => {
      try {
        const blob = await pdf(<InvoiceDocument data={sanitizedData} styleType={styleType} />).toBlob();
        const blobUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setPdfUrl(blobUrl);
        }
      } catch (error) {
        console.error('PDF generation error:', error);
        if (isMounted) setPdfUrl(null);
      }
    };

    timeoutId = setTimeout(() => {
      generatePDF();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [sanitizedData, styleType]);

  return (
    <Container size="100%" px="xl" py="md">
      <Grid gutter="xl" columns={12}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={4}>Configure Invoice</Title>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <Accordion
                type="multiple"
                value={opened}
                onChange={setOpened}
                variant="separated"
              >
                <Accordion.Item value="general">
                  <Accordion.Control>General Info</Accordion.Control>
                  <Accordion.Panel>
                    <GeneralSection
                      useDueDays={useDueDays}
                      dueInDays={dueInDays}
                      onToggleDueDays={setUseDueDays}
                      onChangeDueInDays={setDueInDays}
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="from">
                  <Accordion.Control>From (Sender)</Accordion.Control>
                  <Accordion.Panel>
                    <FromSection />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="to">
                  <Accordion.Control>Bill To (Client)</Accordion.Control>
                  <Accordion.Panel>
                    <ToSection />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="items">
                  <Accordion.Control>Line Items</Accordion.Control>
                  <Accordion.Panel>
                    <ItemsSection />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="payment">
                  <Accordion.Control>Payment Info</Accordion.Control>
                  <Accordion.Panel>
                    <PaymentSection />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </form>
          </FormikProvider>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <PDFPreviewPanel
            invoiceData={sanitizedData}
            styleType={styleType}
            setStyleType={setStyleType}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default InvoiceForm;
