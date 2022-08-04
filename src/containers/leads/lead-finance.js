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
import { format, parseISO } from 'date-fns';

const now = new Date().toISOString();

export const LeadFinance = () => {
    const [leadState, setRefresh] = useOutletContext();
    const [openEditExtraDialog, setOpenEditExtraDialog] = useState(false);
    const [openAddExtraDialog, setOpenAddExtraDialog] = useState(false);
    const [openEditPriceDialog, setOpenEditPriceDialog] = useState(false);
    const [openFinanceDialog, setOpenFinanceDialog] = useState(false);
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

    const financeFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            rebate_applied: leadState.data?.rebate_applied || false,
            rebate_type: leadState.data?.rebate_type || '',
            rebate_expiry: parseISO(leadState.data?.rebate_expiry) || now,
            rebate_attachment: leadState.data?.rebate_attachment || '',
            finance_applied: leadState.data?.finance_applied || false,
            finance_amount: leadState.data?.finance_amount || '',
            finance_interest: leadState.data?.finance_interest || '',
            finance_terms: leadState.data?.finance_terms || '',
            finance_repayment: leadState.data?.finance_repayment || '',
            finance_institution: leadState.data?.finance_institution || '',
            finance_attachment: leadState.data?.finance_attachment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            rebate_applied: Yup.bool(),
            rebate_type: Yup.string().max(255),
            rebate_expiry: Yup.date(),
            rebate_attachment: Yup.string().max(255),
            finance_applied: Yup.bool(),
            finance_amount: Yup.number()
                .min(0, 'Must be positive')
                .typeError('Must be a number'),
            finance_interest: Yup.number()
                .min(0, 'Must be positive')
                .typeError('Must be a number'),
            finance_terms: Yup.string().max(255),
            finance_repayment: Yup.number()
                .min(0, 'Must be positive')
                .typeError('Must be a number'),
            finance_institution: Yup.string().max(255),
            finance_attachment: Yup.string().max(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let lead_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateLead(
                    leadState.data.lead_id,
                    lead_values
                );
                if (res.status === 201) {
                    toast.success('Lead updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);

                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenFinanceDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const financeFormFields = [
        {
            id: 1,
            variant: 'Control',
            width: 12,
            touched: financeFormik.touched.rebate_applied,
            errors: financeFormik.errors.rebate_applied,
            value: financeFormik.values.rebate_applied,
            label: 'Rebate Applied',
            name: 'rebate_applied',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: financeFormik.touched.rebate_type,
            errors: financeFormik.errors.rebate_type,
            value: financeFormik.values.rebate_type,
            label: 'Rebate Type',
            name: 'rebate_type',
            hidden: !financeFormik.values.rebate_applied,
        },
        {
            id: 3,
            variant: 'Date',
            label: 'Rebate Expiry Date',
            name: 'rebate_expiry',
            touched: financeFormik.touched.rebate_expiry,
            errors: financeFormik.errors.rebate_expiry,
            value: financeFormik.values.rebate_expiry,
            hidden: !financeFormik.values.rebate_applied,
            width: 6,
        },
        {
            id: 11,
            variant: 'Upload',
            width: 12,
            touched: financeFormik.touched.rebate_attachment,
            errors: financeFormik.errors.rebate_attachment,
            value: financeFormik.values.rebate_attachment,
            label: 'Upload Rebate Attachment',
            name: 'rebate_attachment',
            multiple: false,
            hidden: !financeFormik.values.rebate_applied,
        },
        {
            id: 4,
            variant: 'Control',
            width: 12,
            touched: financeFormik.touched.finance_applied,
            errors: financeFormik.errors.finance_applied,
            value: financeFormik.values.finance_applied,
            label: 'Finance Applied',
            name: 'finance_applied',
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: financeFormik.touched.finance_amount,
            errors: financeFormik.errors.finance_amount,
            value: financeFormik.values.finance_amount,
            label: 'Finance Amount',
            name: 'finance_amount',
            hidden: !financeFormik.values.finance_applied,
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: financeFormik.touched.finance_interest,
            errors: financeFormik.errors.finance_interest,
            value: financeFormik.values.finance_interest,
            label: 'Finance Interest',
            name: 'finance_interest',
            hidden: !financeFormik.values.finance_applied,
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: financeFormik.touched.finance_terms,
            errors: financeFormik.errors.finance_terms,
            value: financeFormik.values.finance_terms,
            label: 'Finance Terms',
            name: 'finance_terms',
            hidden: !financeFormik.values.finance_applied,
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: financeFormik.touched.finance_repayment,
            errors: financeFormik.errors.finance_repayment,
            value: financeFormik.values.finance_repayment,
            label: 'Finance Repayment',
            name: 'finance_repayment',
            hidden: !financeFormik.values.finance_applied,
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: financeFormik.touched.finance_institution,
            errors: financeFormik.errors.finance_institution,
            value: financeFormik.values.finance_institution,
            label: 'Finance Institution',
            name: 'finance_institution',
            hidden: !financeFormik.values.finance_applied,
        },
        {
            id: 10,
            variant: 'Upload',
            width: 12,
            touched: financeFormik.touched.finance_attachment,
            errors: financeFormik.errors.finance_attachment,
            value: financeFormik.values.finance_attachment,
            label: 'Upload Finance Attachment',
            name: 'finance_attachment',
            multiple: false,
            hidden: !financeFormik.values.finance_applied,
        },
    ];

    const downloadFinanceAttachment = () => {
        if (!leadState.data.finance_applied) {
            return;
        }

        bpmAPI.downloadFile(
            leadState.data.finance_attachment,
            `Finance - ${leadState.data.address}.${leadState.data.finance_attachment_ext}`
        );
    };
    const downloadRebateAttachment = () => {
        if (!leadState.data.rebate_applied) {
            return;
        }

        bpmAPI.downloadFile(
            leadState.data.rebate_attachment,
            `Rebate - ${leadState.data.address}.${leadState.data.rebate_attachment_ext}`
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
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenFinanceDialog(true)}
                                title="Financing"
                                allowEdit={
                                    leadState.data.status_id < 5 ||
                                    leadState.data.status === 'Review'
                                }
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Rebate Applied',
                                        value: leadState.data.rebate_applied
                                            ? 'Applied'
                                            : 'Not Applied',
                                    },
                                    {
                                        id: 2,
                                        label: 'Rebate Expiry Date',
                                        value: leadState.data.rebate_applied
                                            ? format(
                                                  parseISO(
                                                      leadState.data
                                                          .rebate_expiry
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'No Info',
                                    },
                                    {
                                        id: 3,
                                        label: 'Finance Applied',
                                        value: leadState.data.finance_applied
                                            ? 'Applied'
                                            : 'Not Applied',
                                    },
                                    {
                                        id: 4,
                                        label: 'Interest Rate',
                                        value: leadState.data.finance_applied
                                            ? leadState.data.finance_interest
                                            : 'No Info',
                                    },
                                    {
                                        id: 5,
                                        label: 'Repayment Amount',
                                        value: leadState.data.finance_applied
                                            ? leadState.data.finance_repayment
                                            : 'No Info',
                                    },
                                    {
                                        id: 6,
                                        label: 'Finance Attachment',
                                        value: leadState.data.finance_applied
                                            ? 'Download'
                                            : null,
                                        onClick: downloadFinanceAttachment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Rebate Type',
                                        value: leadState.data.rebate_applied
                                            ? leadState.data.rebate_type
                                            : 'No Info',
                                    },
                                    {
                                        id: 2,
                                        label: 'Rebate Attachment',
                                        value: leadState.data.rebate_applied
                                            ? 'Download'
                                            : null,
                                        onClick: downloadRebateAttachment,
                                    },
                                    {
                                        id: 3,
                                        label: 'Finance Amount',
                                        value: leadState.data.finance_applied
                                            ? leadState.data.finance_amount
                                            : 'No Info',
                                    },
                                    {
                                        id: 4,
                                        label: 'Terms',
                                        value: leadState.data.finance_applied
                                            ? leadState.data.finance_terms
                                            : 'No Info',
                                    },
                                    {
                                        id: 5,
                                        label: 'Finance Institution',
                                        value: leadState.data.finance_applied
                                            ? leadState.data.finance_institution
                                            : 'No Info',
                                    },
                                ]}
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
                <FormDialog
                    onClose={() => setOpenFinanceDialog(false)}
                    open={openFinanceDialog}
                    formik={financeFormik}
                    title="Edit Finance Info"
                    fields={financeFormFields}
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
