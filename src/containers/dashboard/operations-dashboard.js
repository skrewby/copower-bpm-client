import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography } from '@mui/material';

export const OperationsDashboard = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Box sx={{ py: 4 }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                            }}
                        >
                            <Typography color="textPrimary" variant="h4">
                                Operations Dashboard
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};
