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
import { LeadLogAdd } from '../../components/lead/lead-log-add';
import { LeadLogEntry } from '../../components/lead/lead-log-entry';

export const LeadLog = () => {
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
                    data: result,
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
                            <LeadLogAdd onSend={handleCreateLog} />
                            {leadLogs.data.map((log) => (
                                <LeadLogEntry key={log.log_id} log={log} />
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
