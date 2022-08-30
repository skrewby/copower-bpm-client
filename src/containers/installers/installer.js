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

export const Installer = () => {
    let { installerID } = useParams();
    const mounted = useMounted();
    const [installerState, setInstallerState] = useState({ isLoading: true });
    const [files, setFiles] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/installer/${installerID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/installer/${installerID}/installs`,
            label: 'Installs',
        },
    ];

    const getInstaller = useCallback(async () => {
        setInstallerState(() => ({ isLoading: true }));
        setFiles([]);

        try {
            const result = await bpmAPI.getInstaller(installerID);
            const filesResult = await bpmAPI.getInstallerFiles(installerID);

            if (mounted.current) {
                setInstallerState(() => ({
                    isLoading: false,
                    data: result,
                }));
                setFiles(filesResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInstallerState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [installerID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getInstaller().catch(console.error);
    }, [getInstaller, refresh]);

    const renderContent = () => {
        if (installerState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installerState.error) {
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
                            {installerState.error}
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
                            to="/bpm/organisation/installers"
                            variant="text"
                        >
                            Installers
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            {`#${installerState.data.installer_id} - ${installerState.data.name}`}
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
                <Outlet context={[installerState, setRefresh, files]} />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Installer | Solar BPM</title>
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
