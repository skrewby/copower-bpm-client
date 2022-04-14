import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
    Box,
    Container,
    fabClasses,
    Grid,
    Skeleton,
    Typography,
} from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { useOutletContext } from 'react-router-dom';
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpmAPI';
import { CustomerLogEntry } from '../../components/customers/customer-log-entry';
import { CustomerLogAdd } from '../../components/customers/customer-log-add';

export const CustomerLog = (props) => {
    const { customer, setRefresh } = props;
    const mounted = useMounted();

    const [customerLogs, setCustomerLogs] = useState({
        isLoading: true,
        data: [],
    });

    const getData = useCallback(async () => {
        setCustomerLogs({ isLoading: true, data: [] });

        try {
            const result = await bpmAPI.getCustomerLogs(customer.customer_id);

            if (mounted.current) {
                setCustomerLogs(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setCustomerLogs(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [customer.customer_id, mounted]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, setRefresh]);

    const handleCreateLog = (content) => {
        setRefresh(true);
        bpmAPI.createCustomerLog(customer.customer_id, content, false);
        toast.success('Log added');
    };

    const renderContent = () => {
        if (customerLogs.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (customerLogs.error) {
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
                            {customerLogs.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 1,
                            }}
                        >
                            <CustomerLogAdd onSend={handleCreateLog} />
                            {customerLogs.data.map((log) => (
                                <CustomerLogEntry key={log.log_id} log={log} />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </>
        );
    };

    return (
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
    );
};
