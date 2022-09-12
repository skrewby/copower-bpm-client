import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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

// Local Imports
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { TableCard } from '../../components/cards/table-card';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { useDialog } from '../../hooks/use-dialog';
import { InstallProgress } from './install-progress';
import { format, parseISO } from 'date-fns';

export const InstallFinance = () => {
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();
    const now = new Date();

    const [openPaymentsDialog, setOpenPaymentsDialog] = useState(false);
    const [openEditExtraDialog, setOpenEditExtraDialog] = useState(false);
    const [openAddExtraDialog, setOpenAddExtraDialog] = useState(false);
    const [openEditPriceDialog, setOpenEditPriceDialog] = useState(false);
    const [openFinanceDialog, setOpenFinanceDialog] = useState(false);
    const [openSTCDialog, setOpenSTCDialog] = useState(false);

    const [statusOptions, setStatusOptions] = useState([]);
    const [extras, setExtras] = useState([]);
    const [internalPrice, setInternalPrice] = useState();
    const [discount, setDiscount] = useState();
    // Check if the system was sold at a discount (true) or at a surplus (false)
    const [isDiscount, setIsDiscount] = useState(true);
    // Currently selected extra in the price card
    const [selectedExtra, setSelectedExtra] = useState(null);

    const [
        deleteExtraDialogOpen,
        handleOpenDeleteExtraDialog,
        handleCloseDeleteExtraDialog,
    ] = useDialog();

    let navigate = useNavigate();

    const getData = useCallback(async () => {
        setStatusOptions([]);
        setExtras([]);

        try {
            const statusOptionsAPI = await bpmAPI.getInstallStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });
            const extrasResult = await bpmAPI.getInstallExtras(
                installState.data.install_id
            );
            if (
                installState.data.finance.selling_price &&
                installState.data.finance.base_price
            ) {
                const extra_prices = extrasResult.map((row) =>
                    Number(row.price)
                );
                const extras_total = extra_prices.reduce(
                    (previousValue, currentValue) =>
                        previousValue + currentValue,
                    0
                );
                const inPrice =
                    Number(installState.data.finance.base_price) + extras_total;
                setInternalPrice(inPrice);

                const d =
                    ((inPrice -
                        Number(installState.data.finance.selling_price)) /
                        inPrice) *
                    100;
                const dis = d.toFixed(2);
                setDiscount(dis);

                if (dis <= 0) {
                    setIsDiscount(false);
                    setDiscount(dis * -1);
                }
            }

            if (mounted.current) {
                setStatusOptions(statusOptionsResult);
                setExtras(extrasResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setStatusOptions(() => ({
                    error: err.message,
                }));
                setExtras(() => ({
                    error: err.message,
                }));
            }
        }
    }, [
        installState.data.finance.base_price,
        installState.data.finance.selling_price,
        installState.data.install_id,
        mounted,
    ]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const paymentsFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            deposit_paid: installState.data?.finance.deposit_paid || false,
            deposit_amount: installState.data?.finance.deposit_amount || '',
            deposit_paid_date:
                parseISO(installState.data?.finance.deposit_paid_date) || now,
            invoice_paid: installState.data?.finance.invoice_paid || false,
            invoice_amount: installState.data?.finance.invoice_amount || '',
            invoice_paid_date:
                parseISO(installState.data?.finance.invoice_paid_date) || now,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            deposit_paid: Yup.boolean(),
            deposit_amount: Yup.number(),
            deposit_paid_date: Yup.date(),
            invoice_paid: Yup.boolean(),
            invoice_amount: Yup.number(),
            invoice_paid_date: Yup.date(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                let payments_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    payments_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenPaymentsDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const paymentsFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Deposit Paid',
            name: 'deposit_paid',
            touched: paymentsFormik.touched.deposit_paid,
            errors: paymentsFormik.errors.deposit_paid,
            value: paymentsFormik.values.deposit_paid,
            width: 12,
        },
        {
            id: 2,
            variant: 'Date',
            label: 'Date Deposit Paid',
            name: 'deposit_paid_date',
            touched: paymentsFormik.touched.deposit_paid_date,
            errors: paymentsFormik.errors.deposit_paid_date,
            value: paymentsFormik.values.deposit_paid_date,
            hidden: !paymentsFormik.values.deposit_paid,
            width: 6,
        },
        {
            id: 3,
            variant: 'Input',
            label: 'Deposit Amount',
            name: 'deposit_amount',
            touched: paymentsFormik.touched.deposit_amount,
            errors: paymentsFormik.errors.deposit_amount,
            value: paymentsFormik.values.deposit_amount,
            hidden: !paymentsFormik.values.deposit_paid,
            width: 6,
        },
        {
            id: 4,
            variant: 'Control',
            label: 'Invoice Paid',
            name: 'invoice_paid',
            touched: paymentsFormik.touched.invoice_paid,
            errors: paymentsFormik.errors.invoice_paid,
            value: paymentsFormik.values.invoice_paid,
            width: 12,
        },
        {
            id: 5,
            variant: 'Date',
            label: 'Date Invoice Paid',
            name: 'invoice_paid_date',
            touched: paymentsFormik.touched.invoice_paid_date,
            errors: paymentsFormik.errors.invoice_paid_date,
            value: paymentsFormik.values.invoice_paid_date,
            hidden: !paymentsFormik.values.invoice_paid,
            width: 6,
        },
        {
            id: 6,
            variant: 'Input',
            label: 'Invoice Amount',
            name: 'invoice_amount',
            touched: paymentsFormik.touched.invoice_amount,
            errors: paymentsFormik.errors.invoice_amount,
            value: paymentsFormik.values.invoice_amount,
            hidden: !paymentsFormik.values.invoice_paid,
            width: 6,
        },
    ];

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
                await bpmAPI.addExtraToInstall(
                    installState.data.install_id,
                    values
                );
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
                await bpmAPI.updateInstallExtra(
                    installState.data.install_id,
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
        bpmAPI.deleteExtraFromInstall(
            installState.data.install_id,
            selectedExtra.id
        );
        setRefresh(true);
        setSelectedExtra(null);
        handleCloseDeleteExtraDialog();
    };

    const editPriceFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            selling_price: installState?.data.finance.selling_price || '',
            base_price: installState?.data.finance.base_price || '',
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
                await bpmAPI.updateInstall(
                    installState.data.install_id,
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
            content: `${installState?.data.finance.selling_price ? '$' : ''}${
                installState?.data.finance.selling_price || ''
            }`,
            label: 'Selling Price',
        },
        {
            content: `${installState?.data.finance.base_price ? '$' : ''}${
                installState?.data.finance.base_price || ''
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
            rebate_applied: installState.data?.finance.rebate_applied || false,
            rebate_type: installState.data?.finance.rebate_type || '',
            rebate_expiry:
                parseISO(installState.data?.finance.rebate_expiry) || now,
            rebate_attachment:
                installState.data?.finance.rebate_attachment || '',
            finance_applied:
                installState.data?.finance.finance_applied || false,
            finance_amount: installState.data?.finance.finance_amount || '',
            finance_interest: installState.data?.finance.finance_interest || '',
            finance_terms: installState.data?.finance.finance_terms || '',
            finance_repayment:
                installState.data?.finance.finance_repayment || '',
            finance_institution:
                installState.data?.finance.finance_institution || '',
            finance_attachment:
                installState.data?.finance.finance_attachment || '',
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
                let install_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    install_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
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
        if (!installState.data.finance.finance_applied) {
            return;
        }

        bpmAPI.downloadFile(
            installState.data.finance.finance_attachment,
            `Finance - ${installState.data.property.address}.${installState.data.finance.finance_attachment_ext}`
        );
    };
    const downloadRebateAttachment = () => {
        if (!installState.data.finance.rebate_applied) {
            return;
        }

        bpmAPI.downloadFile(
            installState.data.finance.rebate_attachment,
            `Rebate - ${installState.data.property.address}.${installState.data.finance.rebate_attachment_ext}`
        );
    };
    const downloadSTCForm = () => {
        if (!installState.data.stc.form) {
            return;
        }

        bpmAPI.downloadFile(
            installState.data.stc.form,
            `STC Form - ${installState.data.property.address}.${installState.data.stc.form_ext}`
        );
    };

    const stcFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            stc_submitted: installState.data?.stc.submitted || false,
            stc_submission_date:
                parseISO(installState.data?.stc.submission_date) || now,
            stc_submission_numbers:
                installState.data?.stc.submission_numbers || '',
            stc_submitted_through:
                installState.data?.stc.submitted_through || '',
            stc_approval_received: installState.data?.stc.approved || false,
            stc_approval_date:
                parseISO(installState.data?.stc.approval_date) || now,
            stc_approved_numbers: installState.data?.stc.approved_numbers || '',
            stc_approved_values: installState.data?.stc.approved_values || '',
            stc_receipt_number: installState.data?.stc.receipt_number || '',
            stc_comment: installState.data?.stc.comment || '',
            stc_form: installState.data?.stc.form || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            stc_submitted: Yup.bool(),
            stc_submission_date: Yup.date(),
            stc_submission_numbers: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Must be an integer'),
            stc_submitted_through: Yup.string().max(255),
            stc_approval_received: Yup.bool(),
            stc_approval_date: Yup.date(),
            stc_approved_numbers: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Must be an integer'),
            stc_approved_values: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Must be an integer'),
            stc_receipt_number: Yup.string().max(255),
            stc_comment: Yup.string().max(255),
            stc_form: Yup.string().max(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let install_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    install_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
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

    const stcFormFields = [
        {
            id: 1,
            variant: 'Control',
            width: 12,
            touched: stcFormik.touched.stc_submitted,
            errors: stcFormik.errors.stc_submitted,
            value: stcFormik.values.stc_submitted,
            label: 'STC Submitted',
            name: 'stc_submitted',
        },
        {
            id: 2,
            variant: 'Date',
            label: 'Submission Date',
            name: 'stc_submission_date',
            touched: stcFormik.touched.stc_submission_date,
            errors: stcFormik.errors.stc_submission_date,
            value: stcFormik.values.stc_submission_date,
            hidden: !stcFormik.values.stc_submitted,
            width: 6,
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: stcFormik.touched.stc_submission_numbers,
            errors: stcFormik.errors.stc_submission_numbers,
            value: stcFormik.values.stc_submission_numbers,
            label: 'Number of STC Submitted',
            name: 'stc_submission_numbers',
            hidden: !stcFormik.values.stc_submitted,
        },
        {
            id: 4,
            variant: 'Input',
            width: 12,
            touched: stcFormik.touched.stc_submitted_through,
            errors: stcFormik.errors.stc_submitted_through,
            value: stcFormik.values.stc_submitted_through,
            label: 'Submitted Through',
            name: 'stc_submitted_through',
            hidden: !stcFormik.values.stc_submitted,
        },
        {
            id: 5,
            variant: 'Control',
            width: 12,
            touched: stcFormik.touched.stc_approval_received,
            errors: stcFormik.errors.stc_approval_received,
            value: stcFormik.values.stc_approval_received,
            label: 'STC Approved',
            name: 'stc_approval_received',
        },
        {
            id: 6,
            variant: 'Date',
            label: 'Approval Date',
            name: 'stc_approval_date',
            touched: stcFormik.touched.stc_approval_date,
            errors: stcFormik.errors.stc_approval_date,
            value: stcFormik.values.stc_approval_date,
            hidden: !stcFormik.values.stc_approval_received,
            width: 6,
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: stcFormik.touched.stc_receipt_number,
            errors: stcFormik.errors.stc_receipt_number,
            value: stcFormik.values.stc_receipt_number,
            label: 'Receipt Number',
            name: 'stc_receipt_number',
            hidden: !stcFormik.values.stc_approval_received,
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: stcFormik.touched.stc_approved_numbers,
            errors: stcFormik.errors.stc_approved_numbers,
            value: stcFormik.values.stc_approved_numbers,
            label: 'Number of STC Approved',
            name: 'stc_approved_numbers',
            hidden: !stcFormik.values.stc_approval_received,
        },
        {
            id: 9,
            variant: 'Input',
            width: 6,
            touched: stcFormik.touched.stc_approved_values,
            errors: stcFormik.errors.stc_approved_values,
            value: stcFormik.values.stc_approved_values,
            label: 'Approved STC Value',
            name: 'stc_approved_values',
            hidden: !stcFormik.values.stc_approval_received,
        },
        {
            id: 10,
            variant: 'Input',
            width: 12,
            touched: stcFormik.touched.stc_comment,
            errors: stcFormik.errors.stc_comment,
            value: stcFormik.values.stc_comment,
            label: 'Comment',
            name: 'stc_comment',
            hidden: !stcFormik.values.stc_approval_received,
        },
        {
            id: 11,
            variant: 'Upload',
            width: 12,
            touched: stcFormik.touched.stc_form,
            errors: stcFormik.errors.stc_form,
            value: stcFormik.values.stc_form,
            label: 'Upload STC Form',
            name: 'stc_form',
            multiple: false,
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
                            <InfoCard
                                onEdit={() => setOpenPaymentsDialog(true)}
                                title="Details"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Deposit Payment Date',
                                        value: installState.data.finance
                                            .deposit_paid
                                            ? format(
                                                  parseISO(
                                                      installState.data.finance
                                                          .deposit_paid_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'Awaiting Deposit',
                                    },
                                    {
                                        id: 2,
                                        label: 'Invoice Payment Date',
                                        value: installState.data.finance
                                            .invoice_paid
                                            ? format(
                                                  parseISO(
                                                      installState.data.finance
                                                          .invoice_paid_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'Awaiting Final Payment',
                                    },
                                    {
                                        id: 3,
                                        label: 'Sold By',
                                        value: installState.data.sold_by.name,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Deposit Amount',
                                        value: installState.data.finance
                                            .deposit_paid
                                            ? installState.data.finance
                                                  .deposit_amount
                                            : '-',
                                    },
                                    {
                                        id: 2,
                                        label: 'Invoice Amount',
                                        value: installState.data.finance
                                            .invoice_paid
                                            ? installState.data.finance
                                                  .invoice_amount
                                            : '-',
                                    },
                                    {
                                        id: 3,
                                        label: 'Lead',
                                        value: installState.data.lead_id
                                            ? 'Go to lead'
                                            : '-',
                                        onClick: () => {
                                            if (installState.data.lead_id) {
                                                navigate(
                                                    `/bpm/leads/${installState.data.lead_id}`
                                                );
                                            } else {
                                                toast.error(
                                                    'Install is not linked to a lead!'
                                                );
                                            }
                                        },
                                        active: installState.data.lead_id,
                                    },
                                ]}
                            />
                        </Grid>
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
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Rebate Applied',
                                        value: installState.data.finance
                                            .rebate_applied
                                            ? 'Applied'
                                            : 'Not Applied',
                                    },
                                    {
                                        id: 2,
                                        label: 'Rebate Expiry Date',
                                        value: installState.data.finance
                                            .rebate_applied
                                            ? format(
                                                  parseISO(
                                                      installState.data.finance
                                                          .rebate_expiry
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'No Info',
                                    },
                                    {
                                        id: 3,
                                        label: 'Finance Applied',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? 'Applied'
                                            : 'Not Applied',
                                    },
                                    {
                                        id: 4,
                                        label: 'Interest Rate',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? installState.data.finance
                                                  .finance_interest
                                            : 'No Info',
                                    },
                                    {
                                        id: 5,
                                        label: 'Repayment Amount',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? installState.data.finance
                                                  .finance_repayment
                                            : 'No Info',
                                    },
                                    {
                                        id: 6,
                                        label: 'Finance Attachment',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? 'Download'
                                            : null,
                                        active: installState.data.finance
                                            .finance_applied,
                                        onClick: downloadFinanceAttachment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Rebate Type',
                                        value: installState.data.finance
                                            .rebate_applied
                                            ? installState.data.finance
                                                  .rebate_type
                                            : 'No Info',
                                    },
                                    {
                                        id: 2,
                                        label: 'Rebate Attachment',
                                        value: installState.data.finance
                                            .rebate_applied
                                            ? 'Download'
                                            : null,
                                        active: installState.data.finance
                                            .rebate_applied,
                                        onClick: downloadRebateAttachment,
                                    },
                                    {
                                        id: 3,
                                        label: 'Finance Amount',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? installState.data.finance
                                                  .finance_amount
                                            : 'No Info',
                                    },
                                    {
                                        id: 4,
                                        label: 'Terms',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? installState.data.finance
                                                  .finance_terms
                                            : 'No Info',
                                    },
                                    {
                                        id: 5,
                                        label: 'Finance Institution',
                                        value: installState.data.finance
                                            .finance_applied
                                            ? installState.data.finance
                                                  .finance_institution
                                            : 'No Info',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenSTCDialog(true)}
                                title="STC"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'STC Submitted',
                                        value: installState.data.stc.submitted
                                            ? 'Submitted'
                                            : 'Not Submitted',
                                    },
                                    {
                                        id: 2,
                                        label: 'STC Submission Date',
                                        value: installState.data.stc.submitted
                                            ? format(
                                                  parseISO(
                                                      installState.data.stc
                                                          .submission_date
                                                  ),
                                                  'dd MMM yyyy'
                                              )
                                            : 'No Info',
                                    },
                                    {
                                        id: 3,
                                        label: 'Submission Numbers',
                                        value: installState.data.stc.submitted
                                            ? installState.data.stc
                                                  .submission_numbers
                                            : 'No Info',
                                    },
                                    {
                                        id: 4,
                                        label: 'Receipt Number',
                                        value: installState.data.stc.approved
                                            ? installState.data.stc
                                                  .receipt_number
                                            : 'No Info',
                                    },
                                    {
                                        id: 5,
                                        label: 'Approved Numbers',
                                        value: installState.data.stc.approved
                                            ? installState.data.stc
                                                  .approved_numbers
                                            : 'No Info',
                                    },
                                    {
                                        id: 6,
                                        label: 'Form',
                                        value: installState.data.stc.approved
                                            ? 'Download'
                                            : null,
                                        active: installState.data.stc.form,
                                        onClick: downloadSTCForm,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Submitted By',
                                        value: installState.data.stc.submitted
                                            ? installState.data.stc.submitted_by
                                            : 'No Info',
                                    },
                                    {
                                        id: 2,
                                        label: 'Submitted Through',
                                        value: installState.data.stc.submitted
                                            ? installState.data.stc
                                                  .submitted_through
                                            : 'No Info',
                                    },
                                    {
                                        id: 3,
                                        label: 'STC Approved',
                                        value: installState.data.stc.approved
                                            ? 'Approved'
                                            : 'Not Approved',
                                    },
                                    {
                                        id: 4,
                                        label: 'Confirmed By',
                                        value: installState.data.stc.approved
                                            ? installState.data.stc.approved_by
                                            : 'No Info',
                                    },
                                    {
                                        id: 5,
                                        label: 'Approved Values',
                                        value: installState.data.stc.approved
                                            ? installState.data.stc
                                                  .approved_values
                                            : 'No Info',
                                    },
                                    {
                                        id: 6,
                                        label: 'Comment',
                                        value: installState.data.stc.approved
                                            ? installState.data.stc.comment
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
                            <InstallProgress
                                install={installState.data}
                                statusOptions={statusOptions.filter(
                                    (status) => status.id < 9
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenPaymentsDialog(false)}
                    open={openPaymentsDialog}
                    formik={paymentsFormik}
                    title="Edit Payments"
                    fields={paymentsFormFields}
                />
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
                <FormDialog
                    onClose={() => setOpenSTCDialog(false)}
                    open={openSTCDialog}
                    formik={stcFormik}
                    title="Edit STC Info"
                    fields={stcFormFields}
                />
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
