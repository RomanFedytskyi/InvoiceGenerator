import React from 'react';
import { Stack, TextInput, Textarea } from '@mantine/core';
import { useFormikContext } from 'formik';
import type { InvoiceData } from '../../utils/InvoiceTypes';

const FromSection: React.FC = () => {
  const { values, handleChange } = useFormikContext<InvoiceData>();

  return (
    <Stack data-testid="section-from">
      <TextInput
        label="From Name"
        name="fromName"
        value={values.fromName}
        onChange={handleChange}
        data-testid="input-from-name"
      />
      <Textarea
        label="From Address"
        name="fromAddress"
        value={values.fromAddress}
        onChange={handleChange}
        data-testid="input-from-address"
      />
      <TextInput
        label="Phone"
        name="phone"
        value={values.phone}
        onChange={handleChange}
        data-testid="input-from-phone"
      />
      <TextInput
        label="Email"
        name="email"
        value={values.email}
        onChange={handleChange}
        data-testid="input-from-email"
      />
    </Stack>
  );
};

export default FromSection;
