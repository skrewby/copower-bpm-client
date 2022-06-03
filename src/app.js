import React from 'react';
import { useRoutes } from 'react-router-dom';

// Material UI
import { CssBaseline, ThemeProvider } from '@mui/material';

// Local imports
import { useSettings } from './contexts/settings-context';
import routes from './routes';
import { createCustomTheme } from './theme';
import { useAuth } from './hooks/use-auth';

export const App = () => {
    const { settings } = useSettings();
    const { isInitialized } = useAuth();
    const content = useRoutes(routes);

    const theme = createCustomTheme({
        direction: settings.direction,
        theme: settings.theme,
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {isInitialized && content}
        </ThemeProvider>
    );
};
