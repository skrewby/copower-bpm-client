import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
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
import { installApi } from '../../api/install';
import { ActionsMenu } from '../../components/actions-menu';
import { useMounted } from '../../hooks/use-mounted';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// NOTE: This should be generated based on product data because "/1" represents "/:id" from routing
// //  strategy where ":id" is dynamic depending on current product id
const tabs = [
    {
        href: '/bpm/installs/1',
        label: 'Summary',
    },
    {
        href: '/bpm/installs/1/ptc',
        label: 'PTC',
    },
    {
        href: '/bpm/installs/1/schedule',
        label: 'Schedule',
    },
    {
        href: '/bpm/installs/1/review',
        label: 'Review',
    },
    {
        href: '/bpm/installs/1/retailer',
        label: 'Retailer Notification',
    },
    {
        href: '/bpm/installs/1/stc',
        label: 'STC Submission',
    },
    {
        href: '/bpm/installs/1/finance',
        label: 'Finance',
    },
];

export const Install = () => {
    const mounted = useMounted();
    const [installState, setInstallState] = useState({ isLoading: true });
    const location = useLocation();

    const getInstall = useCallback(async () => {
        setInstallState(() => ({ isLoading: true }));

        try {
            const result = await installApi.getInstall();

            if (mounted.current) {
                setInstallState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInstallState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    useEffect(() => {
        getInstall().catch(console.error);
    }, [getInstall]);

    const handleInstallerPack = () => {
        toast.error('Not implemented yet.');
    };

    const actions = [
        {
            label: 'Download Installer Pack',
            onClick: handleInstallerPack,
        },
    ];

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
                <Box sx={{ py: 4 }}>
                    <Box sx={{ mb: 2 }}>
                        <Button
                            color="primary"
                            component={RouterLink}
                            startIcon={<ArrowBackOutlinedIcon />}
                            to="/bpm/installs"
                            variant="text"
                        >
                            Installs
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            {`${installState.data.reference} - ${installState.data.name}`}
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
                <Outlet />
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
                    maxWidth="lg"
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
