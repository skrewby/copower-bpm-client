import { useEffect } from 'react';

// Libraries
import NProgress from 'nprogress';

// Material UI
import { Box } from '@mui/material';

/**
 * A simple loading animation used when containers are being loaded
 */
export const Loading = () => {
    useEffect(() => {
        NProgress.start();

        return () => {
            NProgress.done();
        };
    }, []);

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                flexGrow: 1,
            }}
        />
    );
};
