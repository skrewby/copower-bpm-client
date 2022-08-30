import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

// Material UI
import {
    Box,
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
import { useDialog } from '../../hooks/use-dialog';

// Containers

// Components
import { InfoCard } from '../../components/cards/info-card';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { TableCard } from '../../components/cards/table-card';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';
import { UploadDialog } from '../../components/dialogs/upload-dialog';
import { ServiceProgress } from './service-progress';
import { format, parseISO } from 'date-fns';

export const ServiceSummary = () => {
    const [service, setRefresh, statusOptions, items, files] =
        useOutletContext();

    const [openChangeAddressDialog, setOpenChangeAddressDialog] =
        useState(false);
    const [openEditServiceDialog, setOpenEditServiceDialog] = useState(false);
    const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const [openAddFileDialog, setOpenAddFileDialog] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
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

    const now = new Date();

    const changeAddressFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            address: service.data.address || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            address: Yup.string().max(255),
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
                    .updateService(service.data.id, values)
                    .then(setRefresh(true));
                setOpenChangeAddressDialog(false);
                if (res.status === 201) {
                    toast.success(`Address changed`);
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

    const changeAddressFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 12,
            touched: changeAddressFormik.touched.address,
            errors: changeAddressFormik.errors.address,
            value: changeAddressFormik.values.address,
            label: 'Address',
            name: 'address',
        },
    ];

    const addItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            description: '',
            price: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            description: Yup.string()
                .max(255)
                .required('Item description required'),
            price: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Price must be a number. Example: 200')
                .required('Price required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                setOpenAddItemDialog(false);
                await bpmAPI.addItemToService(service.data.id, values);
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

    const addItemFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 8,
            touched: addItemFormik.touched.description,
            errors: addItemFormik.errors.description,
            value: addItemFormik.values.description,
            label: 'Description',
            name: 'description',
        },
        {
            id: 2,
            variant: 'Input',
            width: 4,
            touched: addItemFormik.touched.price,
            errors: addItemFormik.errors.price,
            value: addItemFormik.values.price,
            label: 'Price',
            name: 'price',
        },
    ];

    const editItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            description: selectedItem?.description || '',
            price: selectedItem?.price || '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            description: Yup.string()
                .max(255)
                .required('Add description to item'),
            price: Yup.number()
                .min(0, 'Must be a positive number')
                .typeError('Price must be a number. Example: 200'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI.updateServiceItem(
                    service.data.id,
                    selectedItem.id,
                    values
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

    const editItemFormFields = [
        {
            id: 1,
            variant: 'Input',
            width: 8,
            touched: editItemFormik.touched.description,
            errors: editItemFormik.errors.description,
            value: editItemFormik.values.description,
            label: 'Description',
            name: 'description',
        },
        {
            id: 2,
            variant: 'Input',
            width: 4,
            touched: editItemFormik.touched.price,
            errors: editItemFormik.errors.price,
            value: editItemFormik.values.price,
            label: 'Price',
            name: 'price',
        },
    ];

    const itemsRows = (item) => {
        return (
            <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.price}</TableCell>
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
        bpmAPI.deleteItemFromService(service.data.id, selectedItem.id);
        setRefresh(true);
        setSelectedItem(null);
        handleCloseDeleteItemDialog();
    };

    const priceStats = [
        {
            content: `${service.data.cost ? '$' : ''}${
                service.data.cost || ''
            }`,
            label: 'Total Cost',
        },
    ];

    const onFileUpload = async (file, id) => {
        await bpmAPI.addFileToService(service.data.id, id);
    };

    const onFileDelete = (pondID) => {};

    const handleDeleteFile = async () => {
        await bpmAPI.deleteFileFromService(
            service.data.id,
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

    const editServiceFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            visit_scheduled: service.data?.visit_scheduled || false,
            visit: parseISO(service.data.visit) || now,
            paid: service.data?.paid || false,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            visit_scheduled: Yup.boolean(),
            visit: Yup.date(),
            paid: Yup.boolean(),
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
                    .updateService(service.data.id, values)
                    .then(setRefresh(true));
                setOpenEditServiceDialog(false);
                if (res.status === 201) {
                    toast.success(`Success`);
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

    const editServiceFormFields = [
        {
            id: 1,
            variant: 'Control',
            label: 'Visit Booked',
            name: 'visit_scheduled',
            touched: editServiceFormik.touched.visit_scheduled,
            errors: editServiceFormik.errors.visit_scheduled,
            value: editServiceFormik.values.visit_scheduled,
            width: 12,
        },
        {
            id: 2,
            variant: 'DateTime',
            label: 'Visit Date',
            name: 'visit',
            touched: editServiceFormik.touched.visit,
            errors: editServiceFormik.errors.visit,
            value: editServiceFormik.values.visit,
            hidden: !editServiceFormik.values.visit_scheduled,
            width: 6,
        },
        {
            id: 3,
            variant: 'Control',
            label: 'Paid',
            name: 'paid',
            touched: editServiceFormik.touched.paid,
            errors: editServiceFormik.errors.paid,
            value: editServiceFormik.values.paid,
            width: 12,
        },
    ];

    const renderContent = () => {
        if (service.isLoading || statusOptions.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (service.error || statusOptions.error) {
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
                                onEdit={() => setOpenChangeAddressDialog(true)}
                                title="Customer"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Customer Name',
                                        value: service.data.customer_name,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company Name',
                                        value: service.data.customer_company,
                                    },
                                    {
                                        id: 3,
                                        label: 'Email Address',
                                        value: service.data.customer_email,
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Address',
                                        value: service.data.address,
                                    },
                                    {
                                        id: 2,
                                        label: 'Company ABN',
                                        value: service.data.customer_abn,
                                    },
                                    {
                                        id: 3,
                                        label: 'Phone Number',
                                        value: service.data.customer_phone,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard
                                onEdit={() => setOpenEditServiceDialog(true)}
                                title="Details"
                                dataLeft={[
                                    {
                                        id: 1,
                                        label: 'Visit Date',
                                        value: service.data.visit_scheduled
                                            ? format(
                                                  parseISO(service.data.visit),
                                                  'dd MMM yyyy - p'
                                              )
                                            : 'No visit scheduled',
                                    },
                                ]}
                                dataRight={[
                                    {
                                        id: 1,
                                        label: 'Payment',
                                        value: service.data.paid
                                            ? 'Paid'
                                            : 'Not paid',
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TableCard
                                data={items}
                                title="Items"
                                columns={['Item', 'Price', 'Actions']}
                                rows={itemsRows}
                                showStats
                                stats={priceStats}
                                buttonOnClick={() => setOpenAddItemDialog(true)}
                                buttonLabel="Add"
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
                            <ServiceProgress
                                service={service.data}
                                statusOptions={statusOptions.data}
                                refresh={setRefresh}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <FormDialog
                    onClose={() => setOpenChangeAddressDialog(false)}
                    open={openChangeAddressDialog}
                    formik={changeAddressFormik}
                    title="Change Address"
                    fields={changeAddressFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditServiceDialog(false)}
                    open={openEditServiceDialog}
                    formik={editServiceFormik}
                    title="Edit Service"
                    fields={editServiceFormFields}
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
                    onClose={() => setOpenAddItemDialog(false)}
                    open={openAddItemDialog}
                    formik={addItemFormik}
                    title="Add Item"
                    fields={addItemFormFields}
                />
                <FormDialog
                    onClose={() => setOpenEditItemDialog(false)}
                    open={openEditItemDialog}
                    formik={editItemFormik}
                    title="Edit Item"
                    fields={editItemFormFields}
                />
                <ConfirmationDialog
                    message="Are you sure you want to delete this file? This can't be undone."
                    onCancel={handleCloseDeleteFileDialog}
                    onConfirm={handleDeleteFile}
                    open={deleteFileDialogOpen}
                    title="Delete file"
                    variant="error"
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
                <title>Service | Solar BPM</title>
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
