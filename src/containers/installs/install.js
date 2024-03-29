import { useCallback, useEffect, useState } from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
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
import { bpmAPI } from '../../api/bpm/bpm-api';
import { ActionsMenu } from '../../components/actions-menu';
import { useMounted } from '../../hooks/use-mounted';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

const now = new Date().toISOString();

export const Install = () => {
    let { installID } = useParams();
    const mounted = useMounted();
    const [installState, setInstallState] = useState({ isLoading: true });
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/installs/${installID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/installs/${installID}/meter`,
            label: 'Meter',
        },
        {
            href: `/bpm/installs/${installID}/schedule`,
            label: 'Schedule',
        },
        {
            href: `/bpm/installs/${installID}/finance`,
            label: 'Finance',
        },
        {
            href: `/bpm/installs/${installID}/log`,
            label: 'Log',
        },
    ];

    const getInstall = useCallback(async () => {
        setInstallState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getInstall(installID);
            // Need to set null dates to now in order to avoid infinite loops due to the dialogs
            // We did not make the default in the database to current_timestamp as we don't want
            // the default to be a really old date in case the install was created a few months
            // prior
            result.ptc.form_sent_date = result.ptc.form_sent_date ?? now;
            result.ptc.approval_date = result.ptc.approval_date ?? now;
            result.retailer_notice.date = result.retailer_notice.date ?? now;
            result.finance.deposit_paid_date =
                result.finance.deposit_paid_date ?? now;
            result.finance.invoice_paid_date =
                result.finance.invoice_paid_date ?? now;
            result.finance.rebate_expiry = result.finance.rebate_expiry ?? now;
            result.schedule.date = result.schedule.date ?? now;
            result.inspection.booking_date =
                result.inspection.booking_date ?? now;
            result.inspection.completed_date =
                result.inspection.completed_date ?? now;
            result.review.date = result.review.date ?? now;
            result.stc.submission_date = result.stc.submission_date ?? now;
            result.stc.approval_date = result.stc.approval_date ?? now;

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
    }, [installID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getInstall().catch(console.error);
    }, [getInstall, refresh]);

    const handleChangeAddress = () => {
        toast.error('Not implemented yet');
    };

    const actions = [
        {
            label: 'Change Address',
            onClick: handleChangeAddress,
            disabled: false,
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
                            {`#${installState.data.install_id} - ${
                                installState.data.customer.company
                                    ? installState.data.customer.company
                                    : installState.data.customer.name
                            }`}
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
                <Outlet context={[installState, setRefresh]} />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Install | Solar BPM</title>
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
