import { useCallback, useEffect, useState } from 'react';
import {
    Link as RouterLink,
    Outlet,
    useLocation,
    useParams,
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

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
import { useMounted } from '../../hooks/use-mounted';
import { ActionsMenu } from '../../components/actions-menu';
import { FormDialog } from '../../components/dialogs/form-dialog';

// Components
const now = new Date().toISOString();

export const Service = () => {
    const { serviceID } = useParams();
    const mounted = useMounted();
    const [service, setService] = useState({ isLoading: true });
    const [statusOptions, setStatusOptions] = useState({ isLoading: true });
    const [items, setItems] = useState([]);
    const [files, setFiles] = useState([]);
    const [openChangeCustomerDialog, setOpenChangeCustomerDialog] =
        useState(false);
    const [refresh, setRefresh] = useState(false);
    const location = useLocation();

    const tabs = [
        {
            href: `/bpm/services/${serviceID}`,
            label: 'Summary',
        },
        {
            href: `/bpm/services/${serviceID}/log`,
            label: 'Log',
        },
    ];

    const getService = useCallback(async () => {
        setService(() => ({ isLoading: true }));
        setStatusOptions(() => ({ isLoading: true }));
        setItems([]);
        setFiles([]);

        try {
            const result = await bpmAPI.getService(serviceID);
            result.visit = result.visit ?? now;

            const statusOptionsAPI = await bpmAPI.getServiceStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });
            const itemsResult = await bpmAPI.getServiceItems(serviceID);
            const service_prices = itemsResult.map((row) => Number(row.price));
            const service_total = service_prices.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
            );
            result.cost = service_total ?? 0;

            const filesResult = await bpmAPI.getServiceFiles(serviceID);

            if (mounted.current) {
                setService(() => ({
                    isLoading: false,
                    data: result,
                }));
                setStatusOptions(() => ({
                    isLoading: false,
                    data: statusOptionsResult,
                }));
                setItems(itemsResult);
                setFiles(filesResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setService(() => ({
                    isLoading: false,
                    error: err.message,
                }));
                setStatusOptions(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [serviceID, mounted]);

    useEffect(() => {
        setRefresh(false);
        getService().catch(console.error);
    }, [getService, refresh]);

    const handleChangeCustomer = () => {
        setOpenChangeCustomerDialog(true);
    };

    const actions = [
        {
            label: 'Change Customer',
            onClick: handleChangeCustomer,
        },
    ];

    const changeCustomerFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            customer_id: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            customer_id: Yup.number(),
        }),
        onSubmit: async (form_values, helpers) => {
            try {
                // Remove empty strings and null values
                const values = Object.fromEntries(
                    Object.entries(form_values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );
                const res = await bpmAPI
                    .updateService(serviceID, values)
                    .then(setRefresh(true));
                setOpenChangeCustomerDialog(false);
                if (res.status === 201) {
                    toast.success(`Customer assigned`);
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

    const changeCustomerFormFields = [
        {
            id: 1,
            variant: 'Customer Search',
            width: 12,
            touched: changeCustomerFormik.touched.customer_id,
            errors: changeCustomerFormik.errors.customer_id,
            label: 'Change Customer',
            name: 'customer_id',
            allowCreate: false,
        },
    ];

    const renderContent = () => {
        if (service.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (service.error) {
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
                            {service.error}
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
                            to="/bpm/services"
                            variant="text"
                        >
                            Services
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <Typography color="textPrimary" variant="h4">
                            {`#${service.data.id} - ${service.data.customer_name}`}
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
                <Outlet
                    context={[service, setRefresh, statusOptions, items, files]}
                />
                <FormDialog
                    onClose={() => setOpenChangeCustomerDialog(false)}
                    open={openChangeCustomerDialog}
                    formik={changeCustomerFormik}
                    title="Change customer"
                    fields={changeCustomerFormFields}
                />
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
