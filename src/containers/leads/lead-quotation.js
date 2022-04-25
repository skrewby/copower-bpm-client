import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { leadApi } from '../../api/lead';
import { LeadSystemItems } from '../../components/lead/lead-system-items';
import { useMounted } from '../../hooks/use-mounted';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

export const LeadQuotation = () => {
    const mounted = useMounted();
    const [leadState, setLeadState] = useState({ isLoading: true });

    const getLead = useCallback(async () => {
        setLeadState(() => ({ isLoading: true }));

        try {
            const result = await leadApi.getLead();

            if (mounted.current) {
                setLeadState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLeadState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getLead().catch(console.error);
    }, [getLead]);

    const renderContent = () => {
        if (leadState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (leadState.error) {
            return (
                <Box sx={{ py: 4 }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 3,
                        }}
                    >
                        <PriorityHighOutlinedIcon />
                        <Typography
                            color="textSecondary"
                            sx={{ mt: 2 }}
                            variant="body2"
                        >
                            {leadState.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <LeadSystemItems
                            onEdit={() => toast.error('Not implemented yet')}
                            lead={leadState.data}
                        />
                    </Grid>
                </Grid>
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Lead | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {renderContent()}
                </Container>
            </Box>
        </>
    );
};