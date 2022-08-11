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

export const ServiceLog = () => {
    // eslint-disable-next-line no-unused-vars
    const [service, setRefresh, statusOptions, items, files] =
        useOutletContext();
    const mounted = useMounted();

    const [logs, setLogs] = useState({ isLoading: true, data: [] });

    const getData = useCallback(async () => {
        setLogs({ isLoading: true, data: [] });

        try {
            const result = await bpmAPI.getServiceLogs(service.data.id);

            if (mounted.current) {
                setLogs(() => ({
                    isLoading: false,
                    data: result.logs,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLogs(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [mounted, service.data.id]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, setRefresh]);

    const handleCreateLog = async (content) => {
        setRefresh(true);
        bpmAPI.createServiceLog(service.data.id, content, false);
        const roles = await bpmAPI.getValidRoles();
        bpmAPI.createNotification({
            icon: 'comment',
            title: `New entry added to log`,
            details: `${service.data.customer_name}: ${service.data.address}`,
            role: getRoleID(roles, 'Services'),
            href: `/bpm/services/${service.data.id}/log`,
        });
        toast.success('Log added');
    };

    const renderContent = () => {
        if (logs.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (logs.error) {
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
                            {logs.error}
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
                            {logs.data.map((log) => (
                                <LogEntry
                                    key={log.log_id}
                                    log={log}
                                    showStatus={true}
                                    statusDescription="Service Status"
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
