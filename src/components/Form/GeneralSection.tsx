import React from 'react';
import {
  TextInput,
  NumberInput,
  Group,
  Stack,
  Switch,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useFormikContext } from 'formik';
import type { InvoiceData } from '../../utils/InvoiceTypes';

interface GeneralSectionProps {
  useDueDays: boolean;
  dueInDays: number;
  onToggleDueDays: (checked: boolean) => void;
  onChangeDueInDays: (value: number) => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({
  useDueDays,
  dueInDays,
  onToggleDueDays,
  onChangeDueInDays,
}) => {
  const { values, setFieldValue, handleChange } = useFormikContext<InvoiceData>();

  return (
    <Stack data-testid="section-general">
      <TextInput
        label="Company Name"
        name="companyName"
        value={values.companyName}
        onChange={handleChange}
        data-testid="input-company-name"
      />
      <TextInput
        label="Invoice Number"
        name="invoiceNumber"
        value={values.invoiceNumber}
        onChange={handleChange}
        data-testid="input-invoice-number"
      />
      <DateInput
        label="Issued Date"
        value={values.issuedDate as Date}
        onChange={(value) => setFieldValue('issuedDate', value || new Date())}
        data-testid="input-issued-date"
      />
      <Group grow align="flex-end">
        <DateInput
          label="Due Date"
          value={values.dueDate as Date}
          onChange={(value) => setFieldValue('dueDate', value || new Date())}
          disabled={useDueDays}
          data-testid="input-due-date"
        />
        <Stack spacing="xs" style={{ flex: 1 }}>
          <Switch
            label="Set by days after issued"
            checked={useDueDays}
            onChange={(e) => onToggleDueDays(e.currentTarget.checked)}
            size="md"
            mb="xs"
            data-testid="switch-due-days"
          />
          {useDueDays && (
            <NumberInput
              label="Due in (days)"
              value={dueInDays}
              min={0}
              onChange={(val) => onChangeDueInDays(val || 0)}
              data-testid="input-due-in-days"
            />
          )}
        </Stack>
      </Group>
    </Stack>
  );
};

export default GeneralSection;
