import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
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
import { useDialog } from '../../hooks/use-dialog';

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { InstallProgress } from './install-progress';
import { TableCard } from '../../components/cards/table-card';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { UploadDialog } from '../../components/dialogs/upload-dialog';

export const InstallSummary = () => {
    const [installState, setRefresh] = useOutletContext();
    const mounted = useMounted();

    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [openAddSystemItemDialog, setOpenAddSystemItemDialog] =
        useState(false);
    const [openEditSystemDialog, setOpenEditSystemDialog] = useState(false);
    const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
    const [
        deleteFileDialogOpen,
        handleOpenDeleteFileDialog,
        handleCloseDeleteFileDialog,
    ] = useDialog();

    const [phaseOptions, setPhaseOptions] = useState([]);
    const [existingSystemOptions, setExistingSystemOptions] = useState([]);
    const [storyOptions, setStoryOptions] = useState([]);
    const [roofTypeOptions, setRoofTypeOptions] = useState([]);
    const [roofPitchOptions, setRoofPitchOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    const [systemItems, setSystemItems] = useState([]);
    const [files, setFiles] = useState([]);
    // Currently selected item in the system card
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [
        deleteItemDialogOpen,
        handleOpenDeleteItemDialog,
        handleCloseDeleteItemDialog,
    ] = useDialog();

    const getData = useCallback(async () => {
        setPhaseOptions([]);
        setExistingSystemOptions([]);
        setStoryOptions([]);
        setRoofTypeOptions([]);
        setRoofPitchOptions([]);
        setStatusOptions([]);
        setSystemItems([]);
        setFiles([]);

        try {
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
            const roofPitchAPI = await bpmAPI.getRoofPitchOptions();
            const roofPitchResult = roofPitchAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                };
            });

            const statusOptionsAPI = await bpmAPI.getInstallStatusOptions();
            const statusOptionsResult = statusOptionsAPI.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    colour: row.colour,
                };
            });

            const systemResult = await bpmAPI.getInstallSystemItems(
                installState.data.install_id
            );
            const fileResult = await bpmAPI.getInstallFiles(
                installState.data.install_id
            );

            if (mounted.current) {
                setPhaseOptions(phasesResult);
                setExistingSystemOptions(existingSystemResult);
                setStoryOptions(storyOptionsResult);
                setRoofTypeOptions(roofTypeResult);
                setRoofPitchOptions(roofPitchResult);
                setStatusOptions(statusOptionsResult);
                setSystemItems(systemResult);
                setFiles(fileResult);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setPhaseOptions(() => ({ error: err.message }));
                setExistingSystemOptions(() => ({ error: err.message }));
                setStoryOptions(() => ({ error: err.message }));
                setRoofTypeOptions(() => ({ error: err.message }));
                setRoofPitchOptions(() => ({ error: err.message }));
                setStatusOptions(() => ({
                    error: err.message,
                }));
                setSystemItems(() => ({
                    error: err.message,
                }));
            }
        }
    }, [installState.data.install_id, mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const addressFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            address: installState.data?.property.address || '',
            address_id: installState.data?.property.address_id || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            address: Yup.string(),
            address_id: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let address_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    address_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
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

    const addressFormFields = [
        {
            id: 1,
            variant: 'Address',
            label: 'Address',
            name: 'address',
            name_id: 'address_id',
            touched: addressFormik.touched.address,
            errors: addressFormik.errors.address,
            width: 12,
        },
    ];

    const propertyFormik = useFormik({
        validateOnChange: false,
        enableReinitialize: true,
        initialValues: {
            phase_id: installState.data?.property.phase_id || '',
            existing_system_id:
                installState.data?.property.existing_system_id || '',
            story_id: installState.data?.property.story_id || '',
            retailer: installState.data?.property.retailer || '',
            roof_type_id: installState.data?.property.roof_type_id || '',
            roof_pitch_id: installState.data?.property.roof_pitch_id || '',
            distributor: installState.data?.property.distributor || '',
            nmi: installState.data?.property.nmi || '',
            meter: installState.data?.property.meter || '',
            comment: installState.data?.property.comment || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            phase_id: Yup.number(),
            existing_system_id: Yup.number(),
            story_id: Yup.number(),
            retailer: Yup.string(),
            roof_type_id: Yup.number(),
            roof_pitch_id: Yup.number(),
            distributor: Yup.string(),
            nmi: Yup.string(),
            meter: Yup.string(),
            comment: Yup.string(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // Remove empty strings and null values
                let property_values = Object.fromEntries(
                    Object.entries(values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );

                const res = await bpmAPI.updateInstall(
                    installState.data.install_id,
                    property_values
                );
                if (res.status === 201) {
                    toast.success('Install updated');
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
            variant: 'Select',
            width: 6,
            touched: propertyFormik.touched.roof_pitch_id,
            errors: propertyFormik.errors.roof_pitch_id,
            value: propertyFormik.values.roof_pitch_id,
            label: 'Roof Pitch',
            name: 'roof_pitch_id',
            options: roofPitchOptions,
        },
        {
            id: 10,
            variant: 'Input',
            width: 12,
            touched: propertyFormik.touched.comment,
            errors: propertyFormik.errors.comment,
            value: propertyFormik.values.comment,
            label: 'Property Comment',
            name: 'comment',
        },
    ];

    const changeCustomerFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            customer_id: '',
            address: installState.data.property.address || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            customer_id: Yup.number(),
            address: Yup.string().max(255),
        }),
        onSubmit: async (form_values, helpers) => {
            try {
                setOpenCustomerDialog(false);
                const values = Object.fromEntries(
                    Object.entries(form_values).filter(
                        ([_, v]) => v !== null && v !== ''
                    )
                );
                await bpmAPI
                    .updateInstall(installState.data.install_id, values)
                    .then((res) => {
                        if (res.status === 201) {
                            toast.success('Install Updated');
                        }
                        setRefresh(true);
                    });
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
            label: 'Assign Customer',
            touched: changeCustomerFormik.touched.customer_id,
            errors: changeCustomerFormik.errors.customer_id,
            allowCreate: false,
            name: 'customer_id',
        },
        {
            id: 2,
            variant: 'Input',
            width: 12,
            touched: changeCustomerFormik.touched.address,
            errors: changeCustomerFormik.errors.address,
            value: changeCustomerFormik.values.address,
            label: 'Address',
            name: 'address',
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
                await bpmAPI.addItemToInstall(
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
                await bpmAPI.editInstallSystemItem(selectedItem.id, values);
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
            installState.data.system.panel_design,
            `Panel Design - ${installState.data.property.address}.${installState.data.system.panel_design_ext}`
        );
    };

    const downloadDatasheets = () => {
        const systemDatasheets = systemItems.map((item) => item.datasheet);
        bpmAPI.downloadMultipleFiles(
            systemDatasheets,
            `Datasheets - ${installState.data.property.address}`
        );
    };
    const downloadWarranties = () => {
        const systemWarranties = systemItems.map((item) => item.warranty);
        bpmAPI.downloadMultipleFiles(
            systemWarranties,
            `Warranties - ${installState.data.property.address}`
        );
    };

    const onPanelDesignUpload = (file, id) => {};

    const onPanelDesignDelete = (pondID) => {};

    const editSystemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            system_size: installState?.data.system.size || 0,
            panel_design: installState?.data.system.panel_design || '',
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

                await bpmAPI.updateInstall(
                    installState.data.install_id,
                    form_values
                );
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
            content: `${installState?.data.system.size || ''} ${
                installState?.data.system.size ? 'kW' : ''
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
        await bpmAPI.addFileToInstall(installState.data.install_id, id);
    };

    const onFileDelete = (pondID) => {};

    const handleDeleteFile = async () => {
        await bpmAPI.deleteFileFromInstall(
            installState.data.install_id,
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
                                onEdit={() => setOpenCustomerDialog(true)}
                                title="Details"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Customer Name',
                                        value: installState.data.customer.name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company Name',
                                        value: installState.data.customer
                                            .company,
                                    },
                                    {
                                        id: 3,
                                        label: 'Email Address',
                                        value: installState.data.customer.email,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Address',
                                        value: installState.data.property
                                            .address,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company ABN',
                                        value: installState.data.customer.abn,
                                    },
                                    {
                                        id: 3,
                                        label: 'Phone Number',
                                        value: installState.data.customer.phone,
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
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Phases',
                                        value: installState.data.property.phase,
                                    },
                                    {
                                        id: 2,
                                        label: 'Roof Type',
                                        value: installState.data.property
                                            .roof_type,
                                    },
                                    {
                                        id: 3,
                                        label: 'Retailer',
                                        value: installState.data.property
                                            .retailer,
                                    },
                                    {
                                        id: 4,
                                        label: 'NMI',
                                        value: installState.data.property.nmi,
                                    },
                                    {
                                        id: 5,
                                        label: 'Comment',
                                        value: installState.data.property
                                            .comment,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Existing System',
                                        value: installState.data.property
                                            .existing_system,
                                    },
                                    {
                                        id: 2,
                                        label: 'Stories',
                                        value: installState.data.property.story,
                                    },
                                    {
                                        id: 3,
                                        label: 'Distributor',
                                        value: installState.data.property
                                            .distributor,
                                    },
                                    {
                                        id: 4,
                                        label: 'Meter Number',
                                        value: installState.data.property.meter,
                                    },
                                    {
                                        id: 5,
                                        label: 'Roof Pitch',
                                        value: installState.data.property
                                            .roof_pitch,
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
                    onClose={() => setOpenAddressDialog(false)}
                    open={openAddressDialog}
                    formik={addressFormik}
                    title="Edit Address"
                    fields={addressFormFields}
                />
                <FormDialog
                    onClose={() => setOpenPropertyDialog(false)}
                    open={openPropertyDialog}
                    formik={propertyFormik}
                    title="Edit Property Details"
                    fields={propertyFormFields}
                />
                <FormDialog
                    onClose={() => setOpenCustomerDialog(false)}
                    open={openCustomerDialog}
                    formik={changeCustomerFormik}
                    title="Edit Install"
                    fields={changeCustomerFormFields}
                />
                <ConfirmationDialog
                    message="Are you sure you want to delete this item? This can't be undone."
                    onCancel={handleCloseDeleteItemDialog}
                    onConfirm={handleDeleteItem}
                    open={deleteItemDialogOpen}
                    title="Delete item"
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
                <ConfirmationDialog
                    message="Are you sure you want to delete this file? This can't be undone."
                    onCancel={handleCloseDeleteFileDialog}
                    onConfirm={handleDeleteFile}
                    open={deleteFileDialogOpen}
                    title="Delete file"
                    variant="error"
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
