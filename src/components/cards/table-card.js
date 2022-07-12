import React from 'react';
import {
    Button,
    Card,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { generateResourceId } from '../../utils/generate-resource-id';
import { ResourceUnavailable } from '../tables/resource-unavailable';

export const TableCard = (props) => {
    const { data, title, columns, rows, buttonLabel, buttonOnClick, ...other } =
        props;

    const displayUnavailable = data.length === 0;

    return (
        <>
            <Card variant="outlined" {...other}>
                <CardHeader
                    action={
                        <Button
                            color="primary"
                            onClick={buttonOnClick}
                            variant="text"
                        >
                            {buttonLabel}
                        </Button>
                    }
                    title={title}
                />
                <Divider />
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
