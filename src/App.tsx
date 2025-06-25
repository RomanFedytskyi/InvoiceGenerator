import React from 'react';
import { Title, Paper, Box } from '@mantine/core';
import InvoiceForm from './components/InvoiceForm';

const App: React.FC = () => {
  return (
    <Box p="lg">
      <Title order={1} mb="lg" ta="center">
        Invoice Generator
      </Title>

      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <InvoiceForm />
      </Paper>
    </Box>
  );
};

export default App;
