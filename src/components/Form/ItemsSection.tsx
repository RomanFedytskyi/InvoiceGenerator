import React from 'react';
import { FieldArray, FormikProvider, useFormikContext } from 'formik';
import {
  Stack,
  Group,
  TextInput,
  NumberInput,
  Button,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import type { InvoiceData } from '../../utils/InvoiceTypes';

const ItemsSection: React.FC = () => {
  const formik = useFormikContext<InvoiceData>();

  return (
    <FormikProvider value={formik}>
      <FieldArray
        name="items"
        render={({ push, remove }) => (
          <Stack data-testid="section-items">
            {formik.values.items.map((item, index) => (
              <Group key={index} grow align="end" data-testid={`item-${index}`}>
                <TextInput
                  label="Description"
                  name={`items[${index}].description`}
                  value={item.description}
                  onChange={formik.handleChange}
                  data-testid={`input-description-${index}`}
                />
                <NumberInput
                  label="Qty"
                  value={item.qty}
                  onChange={(val) =>
                    formik.setFieldValue(`items[${index}].qty`, val || 0)
                  }
                  data-testid={`input-qty-${index}`}
                />
                <NumberInput
                  label="Price"
                  value={item.price}
                  onChange={(val) =>
                    formik.setFieldValue(`items[${index}].price`, val || 0)
                  }
                  data-testid={`input-price-${index}`}
                />
                <div>
                  <Tooltip label="Remove item">
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => remove(index)}
                      data-testid={`remove-item-${index}`}
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
              data-testid="add-item"
            >
              + Add Item
            </Button>
          </Stack>
        )}
      />
    </FormikProvider>
  );
};

export default ItemsSection;
