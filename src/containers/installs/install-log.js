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
import { useOutletContext, useParams } from 'react-router-dom';
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpmAPI';
import { InstallLogEntry } from '../../components/installs/install-log-entry';
import { InstallLogAdd } from '../../components/installs/install-log-add';

export const InstallLog = () => {
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
                const userList = await bpmAPI.getUsers();
                const logList = result.map((log) => {
                    const user = userList.find(
                        (user) => user.uid === log.created_by
                    );
                    log.user_name = user.displayName;
                    return log;
                });

                setInstallLogs(() => ({
                    isLoading: false,
                    data: logList,
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

    const handleCreateLog = (content) => {
        setRefresh(true);
        bpmAPI.createInstallLog(installID, content, false);
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
                            <InstallLogAdd onSend={handleCreateLog} />
                            {installLogs.data.map((log) => (
                                <InstallLogEntry key={log.log_id} log={log} />
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
