import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';

// Import Libraries
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Material UI
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Import local
import { SettingsProvider } from './contexts/settings-context';
import { AuthProvider } from './contexts/firebase-auth-context';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <AuthProvider>
              <App />
              <Toaster position="bottom-right" />
            </AuthProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
