import { Look } from '../components/calendar/look';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid } from '@mui/material';

export function ViewCalendar() {
    return (
        <>
            <Helmet>
                <title>Office Calendar | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ py: 2, backgroundColor: 'background.default' }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                py: 2,
                            }}
                        ></Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Look />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
