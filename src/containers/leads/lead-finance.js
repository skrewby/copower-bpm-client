import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

// Material UI
import {
    Box,
    Button,
    ButtonGroup,
    Container,
    Divider,
    Grid,
    Skeleton,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';
import { useDialog } from '../../hooks/use-dialog';

// Containers
import { LeadProgress } from './lead-progress';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { TableCard } from '../../components/cards/table-card';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { UploadDialog } from '../../components/dialogs/upload-dialog';

export const LeadFinance = () => {
    const [leadState, setRefresh] = useOutletContext();
    const [openEditExtraDialog, setOpenEditExtraDialog] = useState(false);
    const [openAddExtraDialog, setOpenAddExtraDialog] = useState(false);
    const [openEditPriceDialog, setOpenEditPriceDialog] = useState(false);
    const mounted = useMounted();

    const [sourceOptions, setSourceOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [extras, setExtras] = useState([]);
    const [internalPrice, setInternalPrice] = useState();
    const [discount, setDiscount] = useState();
    // Check if the system was sold at a discount (true) or at a surplus (false)
    const [isDiscount, setIsDiscount] = useState(true);

    // Used to hold any possible customers that were found matching the lead name
    // Right now only used when sending it to Installs
    const [customerSearch, setCustomerSearch] = useState([]);

    // Currently selected extra in the price card
    const [selectedExtra, setSelectedExtra] = useState(null);

    const [
        deleteExtraDialogOpen,
        handleOpenDeleteExtraDialog,
        handleCloseDeleteExtraDialog,
    ] = useDialog();

    const getData = useCallback(async () => {
        setSourceOptions([]);
        setStatusOptions([]);
        setCustomerSearch([]);
        setExtras([]);

        try {
            const sourcesAPI = await bpmAPI.getLeadSources();
            const sourcesFilterd = sourcesAPI.filter((source) => source.active);
            const sourcesResult = sourcesFilterd.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });

            const statusOptionsAPI = await bpmAPI.getLeadStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });
            // If there's a customer name in the result, search if we already have a customer with same name
            const customerAPI = await bpmAPI.searchCustomer(
                leadState.data.name ?? ''
            );
            const customerResult = customerAPI.map((row) => {
                return {
                    id: row.customer_id,
                    customer_id: row.customer_id,
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                };
            });

            const extrasResult = await bpmAPI.getLeadExtras(
                leadState.data.lead_id
            );

            if (leadState.data.selling_price && leadState.data.base_price) {
                const extra_prices = extrasResult.map((row) =>
                    Number(row.price)
                );
                const extras_total = extra_prices.reduce(
                    (previousValue, currentValue) =>
                        previousValue + currentValue,
                    0
                );
                const inPrice =
                    Number(leadState.data.base_price) + extras_total;
                setInternalPrice(inPrice);

                const d =
                    ((inPrice - Number(leadState.data.selling_price)) /
                        Number(leadState.data.selling_price)) *
                    100;
                const dis = d.toFixed(2);
                setDiscount(dis);

                if (dis <= 0) {
                    setIsDiscount(false);
                    setDiscount(dis * -1);
                }
            }

            if (mounted.current) {
                setSourceOptions(sourcesResult);
                setStatusOptions(statusOptionsResult);
                setCustomerSearch(customerResult);
                setExtras(extrasResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setSourceOptions(() => ({ error: err.message }));
                setStatusOptions(() => ({ error: err.message }));
                setCustomerSearch(() => ({
                    error: err.message,
                }));
                setExtras(() => ({
                    error: err.message,
                }));
            }
        }
    }, [
        leadState.data.base_price,
        leadState.data.lead_id,
        leadState.data.name,
        leadState.data.selling_price,
        mounted,
    ]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const addExtraFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            name: '',
            price: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(255).required('Type an extra'),
            price: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Price must be a number. Example: 200')
                .required('Price required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                setOpenAddExtraDialog(false);
                await bpmAPI.addExtraToLead(leadState.data.lead_id, values);
                setRefresh(true);
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

    const addExtraFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 8,
            touched: addExtraFormik.touched.name,
            errors: addExtraFormik.errors.name,
            value: addExtraFormik.values.name,
            label: 'Extra',
            name: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 4,
            touched: addExtraFormik.touched.price,
            errors: addExtraFormik.errors.price,
            value: addExtraFormik.values.price,
            label: 'Price',
            name: 'price',
        },
    ];

    const editExtraFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            name: selectedExtra?.name || '',
            price: selectedExtra?.price || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(255),
            price: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Price must be a number. Example: 200'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.updateLeadExtra(
                    leadState.data.lead_id,
                    selectedExtra.id,
                    values
                );
                setRefresh(true);
                setOpenEditExtraDialog(false);
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

    const editExtraFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 8,
            touched: editExtraFormik.touched.name,
            errors: editExtraFormik.errors.name,
            value: editExtraFormik.values.name,
            label: 'Extra',
            name: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 4,
            touched: editExtraFormik.touched.price,
            errors: editExtraFormik.errors.price,
            value: editExtraFormik.values.price,
            label: 'Price',
            name: 'price',
        },
    ];

    const extrasRows = (item) => {
        return (
            <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell sx={{ width: 135 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                                setSelectedExtra(item);
                                setOpenEditExtraDialog(true);
                            }}
                            variant="subtitle2"
                        >
                            Edit
                        </Typography>
                        <Divider
                            flexItem
                            orientation="vertical"
                            sx={{ mx: 2 }}
                        />
                        <Typography
                            color="error"
                            onClick={() => {
                                setSelectedExtra(item);
                                handleOpenDeleteExtraDialog();
                            }}
                            sx={{ cursor: 'pointer' }}
                            variant="subtitle2"
                        >
                            Delete
                        </Typography>
                    </Box>
                </TableCell>
            </TableRow>
        );
    };

    const handleDeleteItem = () => {
        bpmAPI.deleteExtraFromLead(leadState.data.lead_id, selectedExtra.id);
        setRefresh(true);
        setSelectedExtra(null);
        handleCloseDeleteExtraDialog();
    };

    const editPriceFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            selling_price: leadState?.data.selling_price || '',
            base_price: leadState?.data.base_price || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            selling_price: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Selling price must be a number. Example: 4000.50'),
            base_price: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Base price must be a number. Example: 4301.66'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.updateLead(leadState.data.lead_id, values);
                setRefresh(true);
                setOpenEditExtraDialog(false);
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

    const editPriceFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: editPriceFormik.touched.selling_price,
            errors: editPriceFormik.errors.selling_price,
            value: editPriceFormik.values.selling_price,
            label: 'Selling Price',
            name: 'selling_price',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: editPriceFormik.touched.base_price,
            errors: editPriceFormik.errors.base_price,
            value: editPriceFormik.values.base_price,
            label: 'Base Price',
            name: 'base_price',
        },
    ];

    const priceStats = [
        {
            content: `${leadState?.data.selling_price ? '$' : ''}${
                leadState?.data.selling_price || ''
            }`,
            label: 'Selling Price',
        },
        {
            content: `${leadState?.data.base_price ? '$' : ''}${
                leadState?.data.base_price || ''
            }`,
            label: 'Base Price',
        },
        {
            content: `${internalPrice ? '$' : ''}${internalPrice || ''}`,
            label: 'Internal Price',
        },
        {
            content: `${discount || ''}${discount ? '%' : ''}`,
            label: `${isDiscount ? 'Discount' : 'Surplus'}`,
            colour: `${isDiscount ? 'error' : 'green'}`,
        },
    ];

    const priceCustomButton = () => {
        return (
            <ButtonGroup variant="text">
                <Button
                    color="primary"
                    onClick={() => setOpenAddExtraDialog(true)}
                    variant="text"
                >
                    Add Extra
                </Button>
                <Button
                    color="primary"
                    onClick={() => setOpenEditPriceDialog(true)}
                    variant="text"
                >
                    Edit
                </Button>
            </ButtonGroup>
        );
    };

    const renderContent = () => {
        if (leadState.isLoading || sourceOptions.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (leadState.error || sourceOptions.error) {
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
                            Error ocurred. Refresh the page
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    <Grid
                        container
                        item
                        lg={8}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <TableCard
                                data={extras}
                                title="Price"
                                columns={['Extra', 'Price', 'Actions']}
                                rows={extrasRows}
                                showStats
                                stats={priceStats}
                                customButton={priceCustomButton}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        lg={4}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <LeadProgress
                                lead={leadState.data}
                                systemItems={extras}
                                customers={customerSearch}
                                statusOptions={statusOptions}
                                refresh={setRefresh}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <ConfirmationDialog
                    message="Are you sure you want to delete this item? This can't be undone."
                    onCancel={handleCloseDeleteExtraDialog}
                    onConfirm={handleDeleteItem}
                    open={deleteExtraDialogOpen}
                    title="Delete item"
                    variant="error"
                />
                <FormDialog
                    onClose={() => setOpenAddExtraDialog(false)}
                    open={openAddExtraDialog}
                    formik={addExtraFormik}
                    title="Add Extra"
                    fields={addExtraFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditExtraDialog(false)}
                    open={openEditExtraDialog}
                    formik={editExtraFormik}
                    title="Edit Item"
                    fields={editExtraFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditPriceDialog(false)}
                    open={openEditPriceDialog}
                    formik={editPriceFormik}
                    title="Edit Price"
                    fields={editPriceFormFields}
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
