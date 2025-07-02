import React from 'react';
import { Stack, TextInput, Textarea } from '@mantine/core';
import { useFormikContext } from 'formik';
import type { InvoiceData } from '../../utils/InvoiceTypes';

const ToSection: React.FC = () => {
  const { values, handleChange } = useFormikContext<InvoiceData>();

  return (
    <Stack data-testid="section-to">
      <TextInput
        label="Client Name"
        name="clientName"
        value={values.clientName}
        onChange={handleChange}
        data-testid="input-client-name"
      />
      <Textarea
        label="Client Address"
        name="clientAddress"
        value={values.clientAddress}
        onChange={handleChange}
        data-testid="input-client-address"
      />
    </Stack>
  );
};

export default ToSection;
