import { useCallback, useEffect, useState } from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useParams,
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { getStatusDetails } from '../../utils/get-status-details';

// Components
import { ActionsMenu } from '../../components/actions-menu';
import { FormDialog } from '../../components/dialogs/form-dialog';

export const Lead = () => {
    const { leadID } = useParams();
    const { user } = useAuth();
    const mounted = useMounted();
    const [leadState, setLeadState] = useState({ isLoading: true });
    const [statusOptions, setStatusOptions] = useState({ isLoading: true });
    const [salesUserOptions, setSalesUserOptions] = useState([]);
    const [openChangeSalesDialog, setOpenChangeSalesDialog] = useState();
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/leads/${leadID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/leads/${leadID}/finance`,
            label: 'Finance',
        },
        {
            href: `/bpm/leads/${leadID}/log`,
            label: 'Log',
        },
    ];

    const getLead = useCallback(async () => {
        setLeadState(() => ({ isLoading: true }));
        setStatusOptions(() => ({ isLoading: true }));
        setSalesUserOptions([]);

        try {
            const result = await bpmAPI.getLead(leadID);
            const statusOptionsAPI = await bpmAPI.getLeadStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });
            const usersAPI = await bpmAPI.getUsers();
            const salesResult = usersAPI.filter(
                (user) => user.disabled === false
            );
            const usersResult = salesResult.map((user) => {
                return {
                    id: user.account_id,
                    name: user.name,
                };
            });
            if (mounted.current) {
                setLeadState(() => ({
                    isLoading: false,
                    data: result,
                }));
                setStatusOptions(() => ({
                    isLoading: false,
                    data: statusOptionsResult,
                }));
                setSalesUserOptions(usersResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setLeadState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setStatusOptions(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setSalesUserOptions(() => ({ error: err.message }));
            }
        }
    }, [leadID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getLead().catch(console.error);
    }, [getLead, refresh]);

    const handleReOpen = () => {
        if (user.role !== 'Sales') {
            bpmAPI.createLeadLog(leadID, `Re-Opened lead`, true);
            bpmAPI.updateLead(leadID, { status_id: 1 }).then(setRefresh(true));
        } else {
            toast.error('Not authorized. Contact an admin');
        }
    };

    const handleAssignSales = () => {
        if (user.role !== 'Sales') {
            setOpenChangeSalesDialog(true);
        } else {
            toast.error('Not authorized. Contact an admin');
        }
    };

    const assignSalesFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            sales_id: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            sales_id: Yup.string().max(255).required('Must assign to an user'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const res = await bpmAPI
                    .updateLead(leadID, values)
                    .then(setRefresh(true));
                setOpenChangeSalesDialog(false);
                if (res.status === 201) {
                    toast.success(`Sales assigned`);
                } else {
                    toast.error(`Something went wrong`);
                }
                helpers.resetForm();
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const assignSalesFormField = [
        {
            id: 1,
            variant: 'Select',
            width: 12,
            touched: assignSalesFormik.touched.sales_id,
            errors: assignSalesFormik.errors.sales_id,
            value: assignSalesFormik.values.sales_id,
            label: 'Assign Sales',
            name: 'sales_id',
            options: salesUserOptions,
        },
    ];

    const getActionMenu = () => {
        if (leadState.isLoading || statusOptions.isLoading) {
            return [];
        }
        const status = leadState.data.status_id;

        const reOpenEnabled =
            status === getStatusDetails(statusOptions.data, 'Closed').id ||
            status === getStatusDetails(statusOptions.data, 'Rejected').id;
        const assignSalesEnabled = !(
            status ===
                getStatusDetails(statusOptions.data, 'Rejected - Pending').id ||
            status === getStatusDetails(statusOptions.data, 'Review').id ||
            status === getStatusDetails(statusOptions.data, 'Closed').id
        );

        const actions = [
            {
                label: 'Re-Open',
                onClick: handleReOpen,
                disabled: !reOpenEnabled,
            },
            {
                label: 'Assign Sales',
                onClick: handleAssignSales,
                disabled: !assignSalesEnabled,
            },
        ];

        return actions;
    };
    const actions = getActionMenu();

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
                        {leadState.data.role !== 'Sales' && (
                            <ActionsMenu actions={actions} />
                        )}
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
                <FormDialog
                    onClose={() => setOpenChangeSalesDialog(false)}
                    open={openChangeSalesDialog}
                    formik={assignSalesFormik}
                    title="Assign a new sales person to the lead"
                    fields={assignSalesFormField}
                />
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
