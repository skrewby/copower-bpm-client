import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Material UI
import {
    Box,
    Container,
    Skeleton,
    Typography,
    Grid,
    TableRow,
    TableCell,
    Tooltip,
    IconButton,
} from '@mui/material';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

// Local import
import { bpmAPI } from '../../api/bpm/bpm-api';
import { useMounted } from '../../hooks/use-mounted';

// Components
import { TableCard } from '../../components/cards/table-card';
import { format, parseISO } from 'date-fns';
import { Status } from '../../components/tables/status';
import { useAuth } from '../../hooks/use-auth';

export const CustomerServices = () => {
    const { customerID } = useParams();
    const mounted = useMounted();
    const [services, setServices] = useState({ isLoading: true });
    let navigate = useNavigate();
    const { user } = useAuth();

    const getData = useCallback(async () => {
        setServices(() => ({ isLoading: true }));

        try {
            const result = await bpmAPI.getCustomerServices(customerID);

            if (mounted.current) {
                setServices(() => ({
                    isLoading: false,
                    data: result,
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setServices(() => ({
                    isLoading: false,
                    error: err.message,
                }));
            }
        }
    }, [customerID, mounted]);

    useEffect(() => {
        getData().catch(console.error);
    }, [getData]);

    const serviceRows = (item) => {
        return (
            <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>
                    {item.description ? item.description.substring(0, 25) : ' '}
                </TableCell>
                <TableCell>
                    <Status
                        color={item.status_colour}
                        label={item.status_label}
                    />
                </TableCell>
                <TableCell>
                    {item.visit_scheduled
                        ? format(parseISO(item.visit), 'dd MMM yyyy')
                        : 'No Date'}
                </TableCell>
                {user.role !== 'Sales' && (
                    <TableCell>
                        <Tooltip title="Service details">
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    navigate(`/bpm/services/${item.id}`);
                                }}
                                size="large"
                                sx={{ order: 3 }}
                            >
                                <ArrowForwardOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                )}
            </TableRow>
        );
    };
    const renderContent = () => {
        if (services.isLoading) {
            return (
                <Box sx={{ py: 4 }}>
                    <Skeleton height={42} />
                    <Skeleton />
                    <Skeleton />
                </Box>
            );
        }

        if (services.error) {
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
                            {services.error}
                        </Typography>
                    </Box>
                </Box>
            );
        }
        return (
            <>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid
                        container
                        item
                        lg={11}
                        spacing={3}
                        sx={{ height: 'fit-content' }}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <TableCard
                                data={services.data}
                                title="Services"
                                columns={[
                                    'ID',
                                    'Address',
                                    'Description',
                                    'Status',
                                    'Visit Date',
                                    'Actions',
                                ]}
                                rows={serviceRows}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title>Customer | Solar BPM</title>
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
