import React, { useMemo, useEffect, useState } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Title,
  NumberInput,
  Grid,
  Container,
  ActionIcon,
  Tooltip,
  Text,
  Accordion,
  Select,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconTrash } from '@tabler/icons-react';
import { pdf } from '@react-pdf/renderer';

import InvoicePDF, { InvoiceDocument } from './InvoicePDF';
import type { InvoiceData } from '../utils/InvoiceTypes';
import { pdfStyles } from '../utils/InvoicePDFStyles';

const LOCAL_STORAGE_KEY = 'invoice-form-data';

const formatDate = (date: Date | string): string =>
  typeof date === 'string' ? date : date.toISOString().split('T')[0];

const loadInitialValues = (): InvoiceData => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        issuedDate: new Date(parsed.issuedDate),
        dueDate: new Date(parsed.dueDate),
      };
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }

  return {
    companyName: '',
    invoiceNumber: '',
    issuedDate: new Date('2025-03-19'),
    dueDate: new Date('2025-05-18'),
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
};

const InvoiceForm: React.FC = () => {
  const formik = useFormik<InvoiceData>({
    initialValues: loadInitialValues(),
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

  const styleOptions = Object.keys(pdfStyles).map((key) => ({
    value: key,
    label: key.replace(/^style/, 'Style '), // e.g., style1 → Style 1
  }));

  const [styleType, setStyleType] = useState(styleOptions[0].value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValues({ ...formik.values });
    }, 200);
    return () => clearTimeout(timeout);
  }, [formik.values]);

  // Save to localStorage on every value change
  useEffect(() => {
    try {
      const dataToStore = {
        ...formik.values,
        issuedDate: formatDate(formik.values.issuedDate),
        dueDate: formatDate(formik.values.dueDate),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (e) {
      console.error('Failed to save form to localStorage:', e);
    }
  }, [formik.values]);

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
        <Grid.Col span={6}>
          <Title order={4}>Configure Invoice</Title>
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
                  <Stack>
                    <TextInput label="Company Name" {...formik.getFieldProps('companyName')} />
                    <TextInput label="Invoice Number" {...formik.getFieldProps('invoiceNumber')} />
                    <DateInput
                      label="Issued Date"
                      value={formik.values.issuedDate as Date}
                      onChange={(value) => formik.setFieldValue('issuedDate', value || '')}
                    />
                    <DateInput
                      label="Due Date"
                      value={formik.values.dueDate as Date}
                      onChange={(value) => formik.setFieldValue('dueDate', value || '')}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="from">
                <Accordion.Control>From (Sender)</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <TextInput label="From Name" {...formik.getFieldProps('fromName')} />
                    <Textarea label="From Address" {...formik.getFieldProps('fromAddress')} />
                    <TextInput label="Phone" {...formik.getFieldProps('phone')} />
                    <TextInput label="Email" {...formik.getFieldProps('email')} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="to">
                <Accordion.Control>Bill To (Client)</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <TextInput label="Client Name" {...formik.getFieldProps('clientName')} />
                    <Textarea label="Client Address" {...formik.getFieldProps('clientAddress')} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="items">
                <Accordion.Control>Line Items</Accordion.Control>
                <Accordion.Panel>
                  <FormikProvider value={formik}>
                    <FieldArray
                      name="items"
                      render={({ push, remove }) => (
                        <Stack>
                          {formik.values.items.map((item, index) => (
                            <Group key={index} grow align="end">
                              <TextInput
                                label="Description"
                                name={`items[${index}].description`}
                                value={item.description}
                                onChange={formik.handleChange}
                              />
                              <NumberInput
                                label="Qty"
                                value={item.qty}
                                onChange={(val) =>
                                  formik.setFieldValue(`items[${index}].qty`, val || 0)
                                }
                              />
                              <NumberInput
                                label="Price"
                                value={item.price}
                                onChange={(val) =>
                                  formik.setFieldValue(`items[${index}].price`, val || 0)
                                }
                              />
                              <div>
                                <Tooltip label="Remove item">
                                  <ActionIcon
                                    color="red"
                                    variant="light"
                                    onClick={() => remove(index)}
                                    mb={4}
                                    ml={10}
                                  >
                                    <IconTrash size="1rem" />
                                  </ActionIcon>
                                </Tooltip>
                              </div>
                            </Group>
                          ))}
                          <Button
                            mt="xs"
                            onClick={() => push({ description: '', qty: 1, price: 0 })}
                            variant="light"
                          >
                            + Add Item
                          </Button>
                        </Stack>
                      )}
                    />
                  </FormikProvider>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="payment">
                <Accordion.Control>Payment Info</Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <TextInput label="Bank Name" {...formik.getFieldProps('bankName')} />
                    <Textarea label="Bank Address" {...formik.getFieldProps('bankAddress')} />
                    <TextInput label="Routing Number" {...formik.getFieldProps('routingNumber')} />
                    <TextInput label="Account Number" {...formik.getFieldProps('accountNumber')} />
                    <TextInput label="Payment Reference" {...formik.getFieldProps('paymentRef')} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </form>
        </Grid.Col>

        <Grid.Col span={6}>
          <Title order={4} style={{ textAlign: 'center' }}>Live PDF Preview</Title>
          <Select
            label="Choose PDF Style"
            value={styleType}
            onChange={(value) => setStyleType(value!)}
            data={styleOptions}
            mb="sm"
            w="200px"
          />
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="invoice preview"
              style={{ width: '100%', height: '90vh', border: '1px solid #ccc' }}
            />
          ) : (
            <Text align="center">Generating PDF preview…</Text>
          )}
          <Group position="center" mt="md">
            <InvoicePDF data={sanitizedData} />
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default InvoiceForm;
