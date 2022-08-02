import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Material UI
import {
    Box,
    Container,
    TableCell,
    TableRow,
    Typography,
    Divider,
    Card,
    Tabs,
    Tab,
    Switch,
    FormControl,
    FormControlLabel,
    FormGroup,
} from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';

// Local imports
import { useMounted } from '../../hooks/use-mounted';
import { bpmAPI } from '../../api/bpm/bpm-api';
import { exportToCsv } from '../../utils/export-csv';
import { useDialog } from '../../hooks/use-dialog';

// Components
import { DataTable } from '../../components/tables/data-table';
import { FormDialog } from '../../components/dialogs/form-dialog';
import { Query } from '../../components/tables/query';
import { ConfirmationDialog } from '../../components/dialogs/confirmation-dialog';

const columns = [
    {
        id: 'id',
        label: 'ID',
    },
    {
        id: 'type_name',
        label: 'Type',
    },
    {
        id: 'brand',
        label: 'Brand',
    },
    {
        id: 'series',
        label: 'Series',
    },
    {
        id: 'model',
        label: 'Model',
    },
    {
        id: 'count',
        label: 'Count',
    },
    {
        id: 'actions',
        label: 'Actions',
    },
];

const views = [
    {
        label: 'Show all',
        value: 'all',
    },
    {
        label: 'Inverters',
        value: 'Inverter',
    },
    {
        label: 'Panels',
        value: 'Panel',
    },
    {
        label: 'Batteries',
        value: 'Battery',
    },
    {
        label: 'Meters',
        value: 'Meter',
    },
    {
        label: 'Rails',
        value: 'Rail',
    },
    {
        label: 'Mount Kits',
        value: 'Mount Kit',
    },
    {
        label: 'Cables',
        value: 'Cable',
    },
    {
        label: 'Others',
        value: 'Other',
    },
];

export const StockItems = () => {
    const [openCreateDialog, setOpenCreateDialog] = useState();

    const [openEditDialog, setOpenEditDialog] = useState();
    // The information of the item that will be modified
    const [itemEdit, setItemEdit] = useState({});

    // Used in the toggle switch to check if only active items should be shown
    const [showOnlyActive, setShowOnlyActive] = useState(true);

    const mounted = useMounted();
    const [refresh, setRefresh] = useState(false);

    const [itemsState, setItemsState] = useState({ isLoading: true });
    const [typeOptions, setTypeOptions] = useState([]);

    const [disableUserOpen, handleOpenDisableUser, handleCloseDisableUser] =
        useDialog();
    const [enableUserOpen, handleOpenEnableUser, handleCloseEnableUser] =
        useDialog();

    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'lead_id',
        view: 'all',
        activeOnly: true,
    });

    const getOptions = useCallback(async () => {
        setTypeOptions([]);

        try {
            const typeOptionsAPI = await bpmAPI.getStockTypes();

            if (mounted.current) {
                setTypeOptions(typeOptionsAPI);
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setTypeOptions(() => ({
                    error: err.message,
                }));
            }
        }
    }, [mounted]);

    const getData = useCallback(async () => {
        setItemsState(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getStockItems({
                filters: controller.filters,
                page: controller.page,
                query: controller.query,
                sort: controller.sort,
                sortBy: controller.sortBy,
                view: controller.view,
                activeOnly: controller.activeOnly,
            });

            if (mounted.current) {
                setItemsState(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setItemsState(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [
        controller.activeOnly,
        controller.filters,
        controller.page,
        controller.query,
        controller.sort,
        controller.sortBy,
        controller.view,
        mounted,
    ]);

    useEffect(() => {
        setRefresh(false);
        getData().catch(console.error);
    }, [getData, refresh]);

    useEffect(() => {
        getOptions().catch(console.error);
    }, [getOptions]);

    const mapFunction = (item) => {
        const textColour = item.active ? 'text.primary' : 'text.secondary';
        return (
            <TableRow hover key={item.id}>
                <TableCell
                    sx={{
                        color: textColour,
                    }}
                >
                    {item.id}
                </TableCell>
                <TableCell
                    sx={{
                        color: textColour,
                    }}
                >
                    {item.type_name}
                </TableCell>
                <TableCell
                    sx={{
                        color: textColour,
                    }}
                >
                    {item.brand}
                </TableCell>
                <TableCell
                    sx={{
                        color: textColour,
                    }}
                >
                    {item.series}
                </TableCell>
                <TableCell
                    sx={{
                        color: textColour,
                    }}
                >
                    {item.model}
                </TableCell>
                <TableCell
                    sx={{
                        color: textColour,
                    }}
                >
                    {item.count}
                </TableCell>
                <TableCell sx={{ width: 145 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography
                            color="primary"
                            onClick={() => {
                                setItemEdit(item);
                                setOpenEditDialog(true);
                            }}
                            sx={{
                                cursor: 'pointer',
                            }}
                            variant="subtitle2"
                        >
                            Edit
                        </Typography>
                        <>
                            <Divider
                                flexItem
                                orientation="vertical"
                                sx={{ mx: 2 }}
                            />
                            {item.active ? (
                                <Typography
                                    color="error"
                                    onClick={() => {
                                        setItemEdit(item);
                                        handleOpenDisableUser();
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                    variant="subtitle2"
                                >
                                    Disable
                                </Typography>
                            ) : (
                                <Typography
                                    color="error"
                                    onClick={() => {
                                        setItemEdit(item);
                                        handleOpenEnableUser();
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                    }}
                                    variant="subtitle2"
                                >
                                    Enable
                                </Typography>
                            )}
                        </>
                    </Box>
                </TableCell>
            </TableRow>
        );
    };

    const handleViewChange = (newView) => {
        setController({
            ...controller,
            page: 0,
            view: newView,
        });
    };

    const handleQueryChange = (newQuery) => {
        setController({
            ...controller,
            page: 0,
            query: newQuery,
        });
    };

    const handlePageChange = (newPage) => {
        setController({
            ...controller,
            page: newPage - 1,
        });
    };

    const handleSortChange = (event, property) => {
        const isAsc =
            controller.sortBy === property && controller.sort === 'asc';

        setController({
            ...controller,
            page: 0,
            sort: isAsc ? 'desc' : 'asc',
            sortBy: property,
        });
    };

    const handleShowOnlyActive = (event) => {
        setShowOnlyActive(event.target.checked);
        setController({
            ...controller,
            activeOnly: event.target.checked,
        });
    };

    const handleDisableUser = () => {
        handleCloseDisableUser();
        bpmAPI.updateStockItem(itemEdit.id, { active: false });
        setRefresh(true);
    };
    const handleEnableUser = () => {
        handleCloseEnableUser();
        bpmAPI.updateStockItem(itemEdit.id, { active: true });
        setRefresh(true);
    };

    const exportItems = () => {
        if (itemsState.data) {
            exportToCsv('stock.csv', itemsState.data.items);
            toast.success('Stock items exported');
        } else {
            toast.error('Something went wrong. Try again later');
        }
    };

    const editItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            type: itemEdit.type || '',
            brand: itemEdit.brand || '',
            series: itemEdit.series || '',
            model: itemEdit.model || '',
            count: itemEdit.count || 0,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            type: Yup.number().integer().required('Type is required'),
            brand: Yup.string().max(255),
            series: Yup.string().max(255),
            model: Yup.string().max(255).required('Model is required'),
            count: Yup.number()
                .integer()
                .min(0, 'Number must be positive or 0'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI
                    .updateStockItem(itemEdit.id, values)
                    .then((res) => {
                        setOpenEditDialog(false);
                        toast.success(`Item Changed`);
                        setRefresh(true);
                    })
                    .catch((err) => {
                        toast.error('There was an error. Try again.');
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

    const editItemFormFields = [
        {
            id: 1,
            variant: 'Select',
            width: 12,
            touched: editItemFormik.touched.type,
            errors: editItemFormik.errors.type,
            value: editItemFormik.values.type,
            label: 'Item Type',
            name: 'type',
            options: typeOptions,
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: editItemFormik.touched.brand,
            errors: editItemFormik.errors.brand,
            value: editItemFormik.values.brand,
            label: 'Brand',
            name: 'brand',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: editItemFormik.touched.series,
            errors: editItemFormik.errors.series,
            value: editItemFormik.values.series,
            label: 'Series',
            name: 'series',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: editItemFormik.touched.model,
            errors: editItemFormik.errors.model,
            value: editItemFormik.values.model,
            label: 'Model',
            name: 'model',
        },
        {
            id: 5,
            variant: 'Input',
            width: 6,
            touched: editItemFormik.touched.count,
            errors: editItemFormik.errors.count,
            value: editItemFormik.values.count,
            label: 'Count',
            name: 'count',
        },
    ];

    const addItemFormik = useFormik({
        enableReinitialize: true,
        validateOnChange: false,
        initialValues: {
            type: '',
            brand: '',
            series: '',
            model: '',
            active: true,
            submit: null,
        },
        validationSchema: Yup.object().shape({
            type: Yup.number().integer().max(255).required('Type is required'),
            brand: Yup.string().max(255),
            series: Yup.string().max(255),
            model: Yup.string().max(255).required('Model is required'),
            active: Yup.boolean(),
        }),
        onSubmit: async (values, helpers) => {
            try {
                await bpmAPI
                    .createStockItem(values)
                    .then((res) => {
                        setOpenCreateDialog(false);
                        toast.success(`Item Created`);
                        setRefresh(true);
                    })
                    .catch((err) => {
                        toast.error('There was an error. Try again.');
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

    const addItemFormFields = [
        {
            id: 1,
            variant: 'Select',
            width: 12,
            touched: addItemFormik.touched.type,
            errors: addItemFormik.errors.type,
            value: addItemFormik.values.type,
            label: 'Item Type',
            name: 'type',
            options: typeOptions,
        },
        {
            id: 2,
            variant: 'Input',
            width: 6,
            touched: addItemFormik.touched.brand,
            errors: addItemFormik.errors.brand,
            value: addItemFormik.values.brand,
            label: 'Brand',
            name: 'brand',
        },
        {
            id: 3,
            variant: 'Input',
            width: 6,
            touched: addItemFormik.touched.series,
            errors: addItemFormik.errors.series,
            value: addItemFormik.values.series,
            label: 'Series',
            name: 'series',
        },
        {
            id: 4,
            variant: 'Input',
            width: 6,
            touched: addItemFormik.touched.model,
            errors: addItemFormik.errors.model,
            value: addItemFormik.values.model,
            label: 'Model',
            name: 'model',
        },
        {
            id: 5,
            variant: 'Control',
            label: 'Active',
            name: 'active',
            touched: addItemFormik.touched.active,
            errors: addItemFormik.errors.active,
            value: addItemFormik.values.active,
            width: 12,
        },
    ];

    const renderContent = () => {
        if (itemsState.error) {
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
                            {itemsState.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return (
            <>
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                    variant="outlined"
                >
                    <Box
                        sx={{
                            px: {
                                sm: 3,
                            },
                        }}
                    >
                        <Tabs
                            onChange={(event, value) =>
                                handleViewChange?.(value)
                            }
                            allowScrollButtonsMobile
                            value={controller.view}
                            variant="scrollable"
                        >
                            {views.map((option) => (
                                <Tab
                                    key={option.label}
                                    label={option.label}
                                    value={option.value}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'grid',
                            gap: 2,
                            gridTemplateColumns: {
                                sm: '1fr auto',
                                xs: 'auto',
                            },
                            justifyItems: 'flex-start',
                            p: 3,
                        }}
                    >
                        <Query
                            onChange={handleQueryChange}
                            sx={{
                                order: {
                                    sm: 2,
                                    xs: 1,
                                },
                            }}
                            value={controller.query}
                        />
                        <FormControl
                            component="fieldset"
                            variant="standard"
                            sx={{ order: 3 }}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showOnlyActive}
                                            onChange={handleShowOnlyActive}
                                        />
                                    }
                                    label="Active Only"
                                    labelPlacement="start"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                    <Divider />
                    <DataTable
                        columns={columns}
                        rowFunction={mapFunction}
                        error={itemsState.error}
                        data={itemsState.data?.items}
                        dataCount={itemsState.data?.itemsCount}
                        isLoading={itemsState.isLoading}
                        onPageChange={handlePageChange}
                        onSortChange={handleSortChange}
                        page={controller.page + 1}
                        sort={controller.sort}
                        sortBy={controller.sortBy}
                        size="small"
                    />
                </Card>
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Stock | Copower BPM</title>
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
            <FormDialog
                onClose={() => setOpenCreateDialog(false)}
                open={openCreateDialog}
                formik={addItemFormik}
                title="Add Item"
                fields={addItemFormFields}
            />
            <FormDialog
                onClose={() => setOpenEditDialog(false)}
                open={openEditDialog}
                formik={editItemFormik}
                title="Edit Item"
                fields={editItemFormFields}
            />
            <ConfirmationDialog
                message="Are you sure you want to disable this item?"
                onCancel={handleCloseDisableUser}
                onConfirm={handleDisableUser}
                open={disableUserOpen}
                title="Disable Item"
                variant="warning"
            />
            <ConfirmationDialog
                message="Are you sure you want to enable this item?"
                onCancel={handleCloseEnableUser}
                onConfirm={handleEnableUser}
                open={enableUserOpen}
                title="Enable Item"
                variant="warning"
            />
        </>
    );
};
