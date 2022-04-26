import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { InstallProgress } from '../../components/installs/install-progress';
import { InstallPTC } from '../../components/installs/meter/install-ptc';
import { InstallPTCDialog } from '../../components/installs/meter/install-ptc-dialog';
import { InstallRetailer } from '../../components/installs/meter/install-retailer';
import { InstallRetailerDialog } from '../../components/installs/meter/install-retailer-dialog';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { useOutletContext } from 'react-router-dom';

export const InstallMeter = () => {
    const [installState, setRefresh] = useOutletContext();

    const [openPTCDialog, setOpenPTCDialog] = useState(false);
    const [openRetailerDialog, setOpenRetailerDialog] = useState(false);

    const renderContent = () => {
        if (installState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installState.error) {
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
                            {installState.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    <Grid
                        container
                        item
                        lg={8}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InstallPTC
                                onEdit={() => setOpenPTCDialog(true)}
                                install={installState.data}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InstallRetailer
                                onEdit={() => setOpenRetailerDialog(true)}
                                install={installState.data}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        lg={4}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <InstallProgress install={installState.data} />
                        </Grid>
                    </Grid>
                </Grid>
                <InstallPTCDialog
                    onClose={() => setOpenPTCDialog(false)}
                    open={openPTCDialog}
                    install={installState.data}
                    refresh={setRefresh}
                />
                <InstallRetailerDialog
                    onClose={() => setOpenRetailerDialog(false)}
                    open={openRetailerDialog}
                    install={installState.data}
                    refresh={setRefresh}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Install | Copower BPM</title>
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
