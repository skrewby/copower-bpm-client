import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import { CustomerInfo } from '../../components/customers/customer-info';
import { CustomerEditDialog } from '../../components/customers/customer-edit-dialog';
import { CustomerLog } from './customer-log';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { useOutletContext } from 'react-router-dom';

export const CustomerSummary = () => {
    const [customerState, setRefresh] = useOutletContext();
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const renderContent = () => {
        if (customerState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (customerState.error) {
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
                            {customerState.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid
                        container
                        item
                        lg={11}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <CustomerInfo
                                onEdit={() => setOpenEditDialog(true)}
                                customer={customerState.data}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <CustomerLog customer={customerState.data} setRefresh={setRefresh} />
                        </Grid>
                    </Grid>
                </Grid>
                <CustomerEditDialog
                    onClose={() => setOpenEditDialog(false)}
                    open={openEditDialog}
                    customer={customerState.data}
                    refresh={setRefresh}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Customer | Copower BPM</title>
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
