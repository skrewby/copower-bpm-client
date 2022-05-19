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

ReactDOM.render(
    <HelmetProvider>
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SettingsProvider>
                    <App />
                    <Toaster position="bottom-right" />
                </SettingsProvider>
            </LocalizationProvider>
        </BrowserRouter>
    </HelmetProvider>,
    document.getElementById('root')
);
