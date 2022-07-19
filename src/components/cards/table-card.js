import React from 'react';
import {
    Button,
    Card,
    CardHeader,
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { generateResourceId } from '../../utils/generate-resource-id';
import { ResourceUnavailable } from '../tables/resource-unavailable';
import { Box } from '@mui/system';

export const TableCard = (props) => {
    const {
        data,
        title,
        columns,
        rows,
        buttonLabel,
        buttonOnClick,
        showStats,
        stats,
        customButton,
        ...other
    } = props;

    const displayUnavailable = data.length === 0;

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader
                    action={
                        customButton ? (
                            customButton()
                        ) : (
                            <Button
                                color="primary"
                                onClick={buttonOnClick}
                                variant="text"
                            >
                                {buttonLabel}
                            </Button>
                        )
                    }
                    title={title}
                />
                <Divider />
                {showStats && stats && (
                    <>
                        {' '}
                        <Grid container spacing={3}>
                            {stats.map((item) => (
                                <Grid
                                    item
                                    key={item.label}
                                    md={3}
                                    sm={6}
                                    xs={12}
                                >
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            borderRadius: 1,
                                            p: 2,
                                        }}
                                    >
                                        <Typography
                                            color="textSecondary"
                                            variant="subtitle1"
                                        >
                                            {item.label}
                                        </Typography>
                                        {item.onClick ? (
                                            <Button
                                                color="primary"
                                                onClick={item.onClick}
                                                variant="text"
                                                disabled={
                                                    item.disabled ?? false
                                                }
                                            >
                                                {item.content}
                                            </Button>
                                        ) : (
                                            <Typography
                                                color={
                                                    item.colour || 'textPrimary'
                                                }
                                                variant="subtitle2"
                                                py={0.5}
                                                px={2}
                                            >
                                                {item.content}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Divider />{' '}
                    </>
                )}
                <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <React.Fragment key={generateResourceId()}>
                                    <TableCell>{col}</TableCell>
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{data.map(rows)}</TableBody>
                </Table>
                {displayUnavailable && <ResourceUnavailable sx={{ m: 2 }} />}
            </Card>
        </>
    );
};
