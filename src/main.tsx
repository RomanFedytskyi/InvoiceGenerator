import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import type { MantineThemeOverride } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import App from './App';

const myTheme: MantineThemeOverride = {
  primaryColor: 'blue',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={myTheme}>
      <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 0 }}>
        <App />
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>
);
