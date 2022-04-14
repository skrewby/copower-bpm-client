import { useCallback, useEffect, useState } from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useParams,
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
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
import { bpmAPI } from '../../api/bpmAPI';
import { ActionsMenu } from '../../components/actions-menu';
import { useMounted } from '../../hooks/use-mounted';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

export const Customer = () => {
    let { customerID } = useParams();
    const mounted = useMounted();
    const [customerState, setCustomerState] = useState({ isLoading: true });
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

        try {
            const result = await bpmAPI.getCustomer(customerID);

            if (mounted.current) {
                setCustomerState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setCustomerState(() => ({
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

    const actions = [

    ];

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
                        <Box sx={{ flexGrow: 1 }} />
                        <ActionsMenu actions={actions} />
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
                <Outlet context={[customerState, setRefresh]} />
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
