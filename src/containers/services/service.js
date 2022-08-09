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

// Local import
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

// Components
const now = new Date().toISOString();

export const Service = () => {
    const { serviceID } = useParams();
    const mounted = useMounted();
    const [service, setService] = useState({ isLoading: true });
    const [statusOptions, setStatusOptions] = useState({ isLoading: true });
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/services/${serviceID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/services/${serviceID}/log`,
            label: 'Log',
        },
    ];

    const getService = useCallback(async () => {
        setService(() => ({ isLoading: true }));
        setStatusOptions(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getService(serviceID);

            const statusOptionsAPI = await bpmAPI.getServiceStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });
            if (mounted.current) {
                setService(() => ({
                    isLoading: false,
                    data: result,
                }));
                setStatusOptions(() => ({
                    isLoading: false,
                    data: statusOptionsResult,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setService(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setStatusOptions(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [serviceID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getService().catch(console.error);
    }, [getService, refresh]);

    const renderContent = () => {
        if (service.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (service.error) {
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
                            {service.error}
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
                            to="/bpm/services"
                            variant="text"
                        >
                            Services
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            {`#${service.data.id} - ${service.data.customer_name}`}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
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
                <Outlet context={[service, setRefresh, statusOptions]} />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Service | Copower BPM</title>
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
