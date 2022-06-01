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

export const LeadLog = () => {
    // eslint-disable-next-line no-unused-vars
    const [leadState, setRefresh] = useOutletContext();
    const mounted = useMounted();
    let { leadID } = useParams();

    const [leadLogs, setLeadLogs] = useState({ isLoading: true, data: [] });

    const getData = useCallback(async () => {
        setLeadLogs({ isLoading: true, data: [] });

        try {
            const result = await bpmAPI.getLeadLogs(leadID);

            if (mounted.current) {
                setLeadLogs(() => ({
                    isLoading: false,
                    data: result.logs,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLeadLogs(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [leadID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, setRefresh]);

    const handleCreateLog = (content) => {
        setRefresh(true);
        bpmAPI.createLeadLog(leadID, content, false);
        toast.success('Log added');
    };

    const renderContent = () => {
        if (leadLogs.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (leadLogs.error) {
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
                            {leadLogs.error}
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
                            {leadLogs.data.map((log) => (
                                <LogEntry
                                    key={log.log_id}
                                    log={log}
                                    showStatus={true}
                                    statusDescription="Lead Status"
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
                <title>Lead | Copower BPM</title>
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
