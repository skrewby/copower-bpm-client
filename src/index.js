import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';

// Import Libraries
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';

// Material UI
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Import local
import { SettingsProvider } from './contexts/settings-context';
import { AuthProvider } from './contexts/auth-context';
import { store } from './store';

ReactDOM.render(
    <HelmetProvider>
        <BrowserRouter>
            <ReduxProvider store={store}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SettingsProvider>
                        <AuthProvider>
                            <App />
                            <Toaster position="bottom-right" />
                        </AuthProvider>
                    </SettingsProvider>
                </LocalizationProvider>
            </ReduxProvider>
        </BrowserRouter>
    </HelmetProvider>,
    document.getElementById('root')
);
