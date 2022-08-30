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

export const LeadSummary = () => {
    const [leadState, setRefresh] = useOutletContext();
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [openAddSystemItemDialog, setOpenAddSystemItemDialog] =
        useState(false);
    const [openEditSystemDialog, setOpenEditSystemDialog] = useState(false);
    const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
    const mounted = useMounted();

    const [sourceOptions, setSourceOptions] = useState([]);
    const [phaseOptions, setPhaseOptions] = useState([]);
    const [existingSystemOptions, setExistingSystemOptions] = useState([]);
    const [storyOptions, setStoryOptions] = useState([]);
    const [roofTypeOptions, setRoofTypeOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [systemItems, setSystemItems] = useState([]);
    const [files, setFiles] = useState([]);

    // Used to hold any possible customers that were found matching the lead name
    // Right now only used when sending it to Installs
    const [customerSearch, setCustomerSearch] = useState([]);

    // Currently selected item in the system card
    const [selectedItem, setSelectedItem] = useState(null);
    // Currently selected file in the files card
    const [selectedFile, setSelectedFile] = useState(null);

    const [
        deleteItemDialogOpen,
        handleOpenDeleteItemDialog,
        handleCloseDeleteItemDialog,
    ] = useDialog();
    const [
        deleteFileDialogOpen,
        handleOpenDeleteFileDialog,
        handleCloseDeleteFileDialog,
    ] = useDialog();

    const getData = useCallback(async () => {
        setSourceOptions([]);
        setPhaseOptions([]);
        setExistingSystemOptions([]);
        setStoryOptions([]);
        setRoofTypeOptions([]);
        setStatusOptions([]);
        setCustomerSearch([]);
        setSystemItems([]);
        setFiles([]);

        try {
            const sourcesAPI = await bpmAPI.getLeadSources();
            const sourcesFilterd = sourcesAPI.filter((source) => source.active);
            const sourcesResult = sourcesFilterd.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });
            const phasesAPI = await bpmAPI.getPhaseOptions();
            const phasesResult = phasesAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.num,
                };
            });
            const existingSystemAPI = await bpmAPI.getExistingSystemOptions();
            const existingSystemResult = existingSystemAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.comment,
                };
            });
            const storyOptionsAPI = await bpmAPI.getStoryOptions();
            const storyOptionsResult = storyOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.num,
                };
            });
            const roofTypeAPI = await bpmAPI.getRoofTypeOptions();
            const roofTypeResult = roofTypeAPI.map((row) => {
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

            const systemResult = await bpmAPI.getLeadSystemItems(
                leadState.data.lead_id
            );

            const fileResult = await bpmAPI.getLeadFiles(
                leadState.data.lead_id
            );

            if (mounted.current) {
                setSourceOptions(sourcesResult);
                setPhaseOptions(phasesResult);
                setExistingSystemOptions(existingSystemResult);
                setStoryOptions(storyOptionsResult);
                setRoofTypeOptions(roofTypeResult);
                setStatusOptions(statusOptionsResult);
                setCustomerSearch(customerResult);
                setSystemItems(systemResult);
                setFiles(fileResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setSourceOptions(() => ({ error: err.message }));
                setPhaseOptions(() => ({ error: err.message }));
                setExistingSystemOptions(() => ({ error: err.message }));
                setStoryOptions(() => ({ error: err.message }));
                setRoofTypeOptions(() => ({ error: err.message }));
                setStatusOptions(() => ({ error: err.message }));
                setCustomerSearch(() => ({
                    error: err.message,
                }));
                setSystemItems(() => ({
                    error: err.message,
                }));
                setFiles(() => ({
                    error: err.message,
                }));
            }
        }
    }, [leadState.data.lead_id, leadState.data.name, mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const leadInfoFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            first_name: leadState.data?.first_name || '',
            last_name: leadState.data?.last_name || '',
            company_name: leadState.data?.company_name || '',
            company_abn: leadState.data?.company_abn || '',
            address: leadState.data?.address || '',
            email: leadState.data?.email || '',
            phone: leadState.data?.phone || '',
            source_id: leadState.data?.source_id || '',
            comment: leadState.data?.comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            first_name: Yup.string()
                .max(255)
                .required('First name is required'),
            last_name: Yup.string().max(255).required('Last name is required'),
            company_name: Yup.string().max(255),
            company_abn: Yup.string().max(255),
            address: Yup.string().max(255).required('Address is required'),
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            phone: Yup.string().max(255).required('Phone number is required'),
            source_id: Yup.number().required('Lead source is required'),
            comment: Yup.string().max(255).default(''),
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
                setOpenInfoDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const propertyFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            phase_id: leadState.data?.phase_id || '',
            existing_system_id: leadState.data?.existing_system_id || '',
            story_id: leadState.data?.story_id || '',
            retailer: leadState.data?.retailer || '',
            roof_type_id: leadState.data?.roof_type_id || '',
            distributor: leadState.data?.distributor || '',
            nmi: leadState.data?.nmi || '',
            meter: leadState.data?.meter || '',
            property_comment: leadState.data?.property_comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            phase_id: Yup.number(),
            existing_system_id: Yup.number(),
            story_id: Yup.number(),
            retailer: Yup.string(),
            roof_type_id: Yup.number(),
            distributor: Yup.string(),
            nmi: Yup.string(),
            meter: Yup.string(),
            property_comment: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let property_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateLead(
                    leadState.data.lead_id,
                    property_values
                );
                if (res.status === 201) {
                    toast.success('Lead updated');
                } else {
                    toast.error('Something went wrong');
                }
                setRefresh(true);
                helpers.setStatus({ success: true });
                helpers.setSubmitting(false);
                setOpenPropertyDialog(false);
            } catch (err) {
                console.error(err);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    const leadInfoFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.first_name,
            errors: leadInfoFormik.errors.first_name,
            value: leadInfoFormik.values.first_name,
            label: 'First Name',
            name: 'first_name',
            type: 'name',
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.last_name,
            errors: leadInfoFormik.errors.last_name,
            value: leadInfoFormik.values.last_name,
            label: 'Last Name',
            name: 'last_name',
            type: 'name',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.company_name,
            errors: leadInfoFormik.errors.company_name,
            value: leadInfoFormik.values.company_name,
            label: 'Company Name',
            name: 'company_name',
            type: 'name',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.company_abn,
            errors: leadInfoFormik.errors.company_abn,
            value: leadInfoFormik.values.company_abn,
            label: 'Company ABN',
            name: 'company_abn',
        },
        {
            id: 5,
            variant: 'Input',
            width: 12,
            touched: leadInfoFormik.touched.address,
            errors: leadInfoFormik.errors.address,
            value: leadInfoFormik.values.address,
            label: 'Address',
            name: 'address',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.email,
            errors: leadInfoFormik.errors.email,
            value: leadInfoFormik.values.email,
            label: 'Email',
            name: 'email',
            type: 'email',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: leadInfoFormik.touched.phone,
            errors: leadInfoFormik.errors.phone,
            value: leadInfoFormik.values.phone,
            label: 'Contact Number',
            name: 'phone',
        },
        {
            id: 8,
            variant: 'Select',
            width: 12,
            touched: leadInfoFormik.touched.source_id,
            errors: leadInfoFormik.errors.source_id,
            value: leadInfoFormik.values.source_id,
            label: 'Lead Source',
            name: 'source_id',
            options: sourceOptions,
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: leadInfoFormik.touched.comment,
            errors: leadInfoFormik.errors.comment,
            value: leadInfoFormik.values.comment,
            label: 'Comment',
            name: 'comment',
        },
    ];

    const propertyFormFields = [
        {
            id: 1,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.phase_id,
            errors: propertyFormik.errors.phase_id,
            value: propertyFormik.values.phase_id,
            label: 'Phases',
            name: 'phase_id',
            options: phaseOptions,
        },
        {
            id: 2,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.existing_system_id,
            errors: propertyFormik.errors.existing_system_id,
            value: propertyFormik.values.existing_system_id,
            label: 'Existing System',
            name: 'existing_system_id',
            options: existingSystemOptions,
        },
        {
            id: 3,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.roof_type_id,
            errors: propertyFormik.errors.roof_type_id,
            value: propertyFormik.values.roof_type_id,
            label: 'Roof Type',
            name: 'roof_type_id',
            options: roofTypeOptions,
        },
        {
            id: 4,
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.story_id,
            errors: propertyFormik.errors.story_id,
            value: propertyFormik.values.story_id,
            label: 'Stories',
            name: 'story_id',
            options: storyOptions,
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.retailer,
            errors: propertyFormik.errors.retailer,
            value: propertyFormik.values.retailer,
            label: 'Retailer',
            name: 'retailer',
        },
        {
            id: 6,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.nmi,
            errors: propertyFormik.errors.nmi,
            value: propertyFormik.values.nmi,
            label: 'NMI',
            name: 'nmi',
        },
        {
            id: 7,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.distributor,
            errors: propertyFormik.errors.distributor,
            value: propertyFormik.values.distributor,
            label: 'Distributor',
            name: 'distributor',
        },
        {
            id: 8,
            variant: 'Input',
            width: 6,
            touched: propertyFormik.touched.meter,
            errors: propertyFormik.errors.meter,
            value: propertyFormik.values.meter,
            label: 'Meter Number',
            name: 'meter',
        },
        {
            id: 9,
            variant: 'Input',
            width: 12,
            touched: propertyFormik.touched.property_comment,
            errors: propertyFormik.errors.property_comment,
            value: propertyFormik.values.property_comment,
            label: 'Property Comment',
            name: 'property_comment',
        },
    ];

    const addSystemItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            item_id: '',
            amount: 0,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            item_id: Yup.number().required('Select an item to add'),
            amount: Yup.number().min(0).required('Select amount'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                setOpenAddSystemItemDialog(false);
                await bpmAPI.addItemToLead(leadState.data.lead_id, values);
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

    const addSystemItemFormFields = [
        {
            id: 1,
            variant: 'Stock Search',
            width: 10,
            label: 'Item',
            touched: addSystemItemFormik.touched.item_id,
            errors: addSystemItemFormik.errors.item_id,
            name: 'item_id',
        },
        {
            id: 2,
            variant: 'Input',
            width: 2,
            touched: addSystemItemFormik.touched.amount,
            errors: addSystemItemFormik.errors.amount,
            value: addSystemItemFormik.values.amount,
            label: 'Amount',
            name: 'amount',
        },
    ];

    const editSystemItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            amount: selectedItem?.amount || 0,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            amount: Yup.number().min(0).required('Select amount'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.editLeadSystemItem(selectedItem.id, values);
                setRefresh(true);
                setOpenEditItemDialog(false);
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

    const editSystemItemFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 6,
            touched: editSystemItemFormik.touched.amount,
            errors: editSystemItemFormik.errors.amount,
            value: editSystemItemFormik.values.amount,
            label: 'Amount',
            name: 'amount',
        },
    ];

    const systemRows = (item) => {
        return (
            <TableRow key={item.id}>
                <TableCell>{item.type_name}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.series}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell sx={{ width: 135 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                                setSelectedItem(item);
                                setOpenEditItemDialog(true);
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
                                setSelectedItem(item);
                                handleOpenDeleteItemDialog();
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
        bpmAPI.deleteLeadSystemItem(selectedItem.id);
        setRefresh(true);
        setSelectedItem(null);
        handleCloseDeleteItemDialog();
    };

    const downloadPanelDesign = () => {
        bpmAPI.downloadFile(
            leadState.data.panel_design,
            `Panel Design - ${leadState.data.address}.${leadState.data.panel_design_ext}`
        );
    };

    const downloadDatasheets = () => {
        toast.error('Not implemented yet');
    };
    const downloadWarranties = () => {
        toast.error('Not implemented yet');
    };

    const onPanelDesignUpload = (file, id) => {};

    const onPanelDesignDelete = (pondID) => {};

    const editSystemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            system_size: leadState?.data.system_size || 0,
            panel_design: leadState?.data.panel_design || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            system_size: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Size must be a number. Example: 6.66'),
            panel_design: Yup.string().max(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const form_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );
                await bpmAPI.updateLead(leadState.data.lead_id, form_values);
                setRefresh(true);
                setOpenEditItemDialog(false);
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

    const editSystemFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 12,
            touched: editSystemFormik.touched.system_size,
            errors: editSystemFormik.errors.system_size,
            value: editSystemFormik.values.system_size,
            label: 'System Size',
            name: 'system_size',
        },
        {
            id: 2,
            variant: 'Upload',
            width: 12,
            touched: editSystemFormik.touched.panel_design,
            errors: editSystemFormik.errors.panel_design,
            value: editSystemFormik.values.panel_design,
            label: 'Update Panel Design',
            name: 'panel_design',
            multiple: false,
            onUpload: onPanelDesignUpload,
            onDelete: onPanelDesignDelete,
        },
    ];

    const systemStats = [
        {
            content: `${leadState?.data.system_size || ''} ${
                leadState?.data.system_size ? 'kW' : ''
            }`,
            label: 'System Size',
        },
        {
            content: 'Download',
            label: 'Proposal',
            onClick: downloadPanelDesign,
            disabled: !editSystemFormik.initialValues.panel_design,
        },
        {
            content: 'Download',
            label: 'Datasheets',
            onClick: downloadDatasheets,
        },
        {
            content: 'Download',
            label: 'Warranties',
            onClick: downloadWarranties,
        },
    ];

    const systemCustomButton = () => {
        return (
            <ButtonGroup variant="text">
                <Button
                    color="primary"
                    onClick={() => setOpenAddSystemItemDialog(true)}
                    variant="text"
                >
                    Add Item
                </Button>
                <Button
                    color="primary"
                    onClick={() => setOpenEditSystemDialog(true)}
                    variant="text"
                >
                    Edit
                </Button>
            </ButtonGroup>
        );
    };

    const onFileUpload = async (file, id) => {
        await bpmAPI.addFileToLead(leadState.data.lead_id, id);
    };

    const onFileDelete = (pondID) => {};

    const handleDeleteFile = async () => {
        await bpmAPI.deleteFileFromLead(
            leadState.data.lead_id,
            selectedFile.file_id
        );
        setRefresh(true);
    };

    const AddFileField = {
        id: 1,
        width: 12,
        label: '',
        multiple: true,
        onUpload: onFileUpload,
        onDelete: onFileDelete,
    };

    const fileRows = (item) => {
        return (
            <TableRow key={item.id}>
                <TableCell>{item.file_name}</TableCell>
                <TableCell sx={{ width: 135 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                                bpmAPI.downloadFile(
                                    item.file_id,
                                    item.file_name
                                );
                            }}
                            variant="subtitle2"
                        >
                            Download
                        </Typography>
                        <Divider
                            flexItem
                            orientation="vertical"
                            sx={{ mx: 2 }}
                        />
                        <Typography
                            color="error"
                            onClick={() => {
                                setSelectedFile(item);
                                handleOpenDeleteFileDialog();
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
                            <InfoCard
                                onEdit={() => setOpenInfoDialog(true)}
                                title="Lead Information"
                                allowEdit={
                                    leadState.data.status_id < 5 ||
                                    leadState.data.status === 'Review'
                                }
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Customer Name',
                                        value: leadState.data.name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company Name',
                                        value: leadState.data.company_name,
                                    },
                                    {
                                        id: 3,
                                        label: 'Email Address',
                                        value: leadState.data.email,
                                    },
                                    {
                                        id: 4,
                                        label: 'Assigned Sales',
                                        value: leadState.data.sales,
                                    },
                                    {
                                        id: 5,
                                        label: 'Comment',
                                        value: leadState.data.comment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Address',
                                        value: leadState.data.address,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company ABN',
                                        value: leadState.data.company_abn,
                                    },
                                    {
                                        id: 3,
                                        label: 'Phone Number',
                                        value: leadState.data.phone,
                                    },
                                    {
                                        id: 4,
                                        label: 'Source',
                                        value: leadState.data.source,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TableCard
                                data={systemItems}
                                title="System"
                                columns={[
                                    'Type',
                                    'Brand',
                                    'Series',
                                    'Model',
                                    'Amount',
                                    'Actions',
                                ]}
                                rows={systemRows}
                                showStats
                                stats={systemStats}
                                customButton={systemCustomButton}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenPropertyDialog(true)}
                                title="Property Details"
                                allowEdit={
                                    leadState.data.status_id < 5 ||
                                    leadState.data.status === 'Review'
                                }
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Phases',
                                        value: leadState.data.phase,
                                    },
                                    {
                                        id: 2,
                                        label: 'Roof Type',
                                        value: leadState.data.roof_type,
                                    },
                                    {
                                        id: 3,
                                        label: 'Retailer',
                                        value: leadState.data.retailer,
                                    },
                                    {
                                        id: 4,
                                        label: 'NMI',
                                        value: leadState.data.nmi,
                                    },
                                    {
                                        id: 5,
                                        label: 'Property Comment',
                                        value: leadState.data.property_comment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Existing System',
                                        value: leadState.data.existing_system,
                                    },
                                    {
                                        id: 2,
                                        label: 'Stories',
                                        value: leadState.data.story,
                                    },
                                    {
                                        id: 3,
                                        label: 'Distributor',
                                        value: leadState.data.distributor,
                                    },
                                    {
                                        id: 4,
                                        label: 'Meter Number',
                                        value: leadState.data.meter,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TableCard
                                data={files}
                                title="Files"
                                columns={['File', 'Actions']}
                                rows={fileRows}
                                buttonLabel="Add Files"
                                buttonOnClick={() => setOpenAddFileDialog(true)}
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
                                systemItems={systemItems}
                                customers={customerSearch}
                                statusOptions={statusOptions}
                                refresh={setRefresh}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenInfoDialog(false)}
                    open={openInfoDialog}
                    formik={leadInfoFormik}
                    title="Edit Lead Info"
                    fields={leadInfoFormFields}
                />
                <FormDialog
                    onClose={() => setOpenPropertyDialog(false)}
                    open={openPropertyDialog}
                    formik={propertyFormik}
                    title="Edit Property Details"
                    fields={propertyFormFields}
                />
                <ConfirmationDialog
                    message="Are you sure you want to delete this item? This can't be undone."
                    onCancel={handleCloseDeleteItemDialog}
                    onConfirm={handleDeleteItem}
                    open={deleteItemDialogOpen}
                    title="Delete item"
                    variant="error"
                />
                <ConfirmationDialog
                    message="Are you sure you want to delete this file? This can't be undone."
                    onCancel={handleCloseDeleteFileDialog}
                    onConfirm={handleDeleteFile}
                    open={deleteFileDialogOpen}
                    title="Delete file"
                    variant="error"
                />
                <FormDialog
                    onClose={() => setOpenAddSystemItemDialog(false)}
                    open={openAddSystemItemDialog}
                    formik={addSystemItemFormik}
                    title="Add Item"
                    fields={addSystemItemFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditItemDialog(false)}
                    open={openEditItemDialog}
                    formik={editSystemItemFormik}
                    title="Edit Item"
                    fields={editSystemItemFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditSystemDialog(false)}
                    open={openEditSystemDialog}
                    formik={editSystemFormik}
                    title="Edit System"
                    fields={editSystemFormFields}
                />
                <UploadDialog
                    onClose={() => {
                        setRefresh(true);
                        setOpenAddFileDialog(false);
                    }}
                    open={openAddFileDialog}
                    title="Upload Files"
                    field={AddFileField}
                />
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Lead | Solar BPM</title>
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
