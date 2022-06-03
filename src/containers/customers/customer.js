import { useCallback, useEffect, useState } from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useParams,
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Material UI
import {
    Box,
    Button,
    Container,
    Skeleton,
    Typography,
    Tab,
    Tabs,
    Divider,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Internal imports
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

export const Customer = () => {
    let { customerID } = useParams();
    const mounted = useMounted();
    const [customerState, setCustomerState] = useState({ isLoading: true });
    const [customerLogs, setCustomerLogs] = useState({
        isLoading: true,
        data: [],
    });
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/customers/${customerID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/customers/${customerID}/installs`,
            label: 'Installs',
        },
        {
            href: `/bpm/customers/${customerID}/services`,
            label: 'Services',
        },
    ];

    const getCustomer = useCallback(async () => {
        setCustomerState(() => ({ isLoading: true }));
        setCustomerLogs({ isLoading: true, data: [] });

        try {
            const result = await bpmAPI.getCustomer(customerID);
            const logResult = await bpmAPI.getCustomerLogs(customerID);

            if (mounted.current) {
                setCustomerState(() => ({
                    isLoading: false,
                    data: result,
                }));
                setCustomerLogs(() => ({
                    isLoading: false,
                    data: logResult,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setCustomerState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setCustomerLogs(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [customerID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getCustomer().catch(console.error);
    }, [getCustomer, refresh]);

    const renderContent = () => {
        if (customerState.isLoading || customerLogs.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (customerState.error || customerLogs.error) {
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
                            {customerState.error
                                ? customerState.error
                                : customerLogs.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Box sx={{ py: 4 }}>
                    <Box sx={{ mb: 2 }}>
                        <Button
                            color="primary"
                            component={RouterLink}
                            startIcon={<ArrowBackOutlinedIcon />}
                            to="/bpm/customers"
                            variant="text"
                        >
                            Customers
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            {`#${customerState.data.customer_id} - ${customerState.data.name}`}
                        </Typography>
                    </Box>
                    <Tabs
                        allowScrollButtonsMobile
                        sx={{ mt: 4 }}
                        value={tabs.findIndex(
                            (tab) => tab.href === location.pathname
                        )}
                        variant="scrollable"
                    >
                        {tabs.map((option) => (
                            <Tab
                                component={RouterLink}
                                key={option.href}
                                label={option.label}
                                to={option.href}
                            />
                        ))}
                    </Tabs>
                    <Divider />
                </Box>
                <Outlet context={[customerState, customerLogs, setRefresh]} />
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
