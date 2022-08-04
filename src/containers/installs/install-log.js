import { useCallback, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

// Material UI
import { Box, Container, Grid, Skeleton, Typography } from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { LogAdd } from '../../components/logs/log-add';
import { LogEntry } from '../../components/logs/log-entry';
import { getRoleID } from '../../utils/get-role-id';

export const InstallLog = () => {
    // eslint-disable-next-line no-unused-vars
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();
    let { installID } = useParams();

    const [installLogs, setInstallLogs] = useState({
        isLoading: true,
        data: [],
    });

    const getData = useCallback(async () => {
        setInstallLogs({ isLoading: true, data: [] });

        try {
            const result = await bpmAPI.getInstallLogs(installID);

            if (mounted.current) {
                setInstallLogs(() => ({
                    isLoading: false,
                    data: result.logs,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setInstallLogs(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [installID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, setRefresh]);

    const handleCreateLog = async (content) => {
        setRefresh(true);
        bpmAPI.createInstallLog(installID, content, false);
        bpmAPI.createNotification({
            icon: 'comment',
            title: `New entry added to log`,
            details: `${installState.data.customer.name}: ${installState.data.property.address}`,
            user: `${installState.data.sold_by.id}`,
            href: `/bpm/installs/${installID}`,
        });
        const roles = await bpmAPI.getValidRoles();
        bpmAPI.createNotification({
            icon: 'comment',
            title: `New entry added to log`,
            details: `${installState.data.customer.name}: ${installState.data.property.address}`,
            role: getRoleID(roles, 'Administration Officer'),
            href: `/bpm/installs/${installID}/log`,
        });
        bpmAPI.createNotification({
            icon: 'comment',
            title: `New entry added to log`,
            details: `${installState.data.customer.name}: ${installState.data.property.address}`,
            role: getRoleID(roles, 'Operations'),
            href: `/bpm/installs/${installID}/log`,
        });
        toast.success('Log added');
    };

    const renderContent = () => {
        if (installLogs.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (installLogs.error) {
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
                            {installLogs.error}
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
                            <LogAdd onSend={handleCreateLog} />
                            {installLogs.data.map((log) => (
                                <LogEntry
                                    key={log.log_id}
                                    log={log}
                                    showStatus={true}
                                    statusDescription="Install Status"
                                />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
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
