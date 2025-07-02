import React from 'react';
import { useFormikContext } from 'formik';
import { Stack, TextInput, Textarea } from '@mantine/core';
import type { InvoiceData } from '../../utils/InvoiceTypes';

const PaymentSection: React.FC = () => {
  const formik = useFormikContext<InvoiceData>();

  return (
    <Stack data-testid="section-payment">
      <TextInput
        label="Bank Name"
        {...formik.getFieldProps('bankName')}
        data-testid="input-bank-name"
      />
      <Textarea
        label="Bank Address"
        {...formik.getFieldProps('bankAddress')}
        data-testid="input-bank-address"
      />
      <TextInput
        label="Routing Number"
        {...formik.getFieldProps('routingNumber')}
        data-testid="input-routing-number"
      />
      <TextInput
        label="Account Number"
        {...formik.getFieldProps('accountNumber')}
        data-testid="input-account-number"
      />
      <TextInput
        label="Payment Reference"
        {...formik.getFieldProps('paymentRef')}
        data-testid="input-payment-reference"
      />
    </Stack>
  );
};

export default PaymentSection;
