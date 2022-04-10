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

export const Lead = () => {
    let { leadID } = useParams();
    const mounted = useMounted();
    const [leadState, setLeadState] = useState({ isLoading: true });
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/leads/${leadID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/leads/${leadID}/quotation`,
            label: 'Quotation',
        },
        {
            href: `/bpm/leads/${leadID}/log`,
            label: 'Log',
        },
    ];

    const getLead = useCallback(async () => {
        setLeadState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getLead(leadID);

            if (mounted.current) {
                setLeadState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLeadState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [leadID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getLead().catch(console.error);
    }, [getLead, refresh]);

    const handleSendQuote = () => {
        toast.error(
            'Not implemented yet. It should create a pdf similar to Pylon quote and send it to customer by email'
        );
    };

    const handleReject = () => {
        toast.error(
            'Not implemented yet. This option will be shown to operations when sales sends lead to operations. A wizard will appear where operations can leave a comment'
        );
    };

    const handleAccept = () => {
        toast.error(
            'Not implemented yet. This option will be shown to operations when sales sends lead to operations'
        );
    };

    const actions = [
        {
            label: 'Send Quote',
            onClick: handleSendQuote,
        },
        {
            label: 'Accept Sale',
            onClick: handleAccept,
        },
        {
            label: 'Reject Sale',
            onClick: handleReject,
        },
    ];

    const renderContent = () => {
        if (leadState.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (leadState.error) {
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
                            {leadState.error}
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
                            to="/bpm/leads"
                            variant="text"
                        >
                            Leads
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            {`#${leadState.data.lead_id} - ${leadState.data.name}`}
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
                <Outlet context={[leadState, setRefresh]} />
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
