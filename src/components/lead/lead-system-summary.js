import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';

export const LeadSystemSummary = (props) => {
    const { lead, ...other } = props;

    return (
        <Table sx={{ minWidth: 500 }} {...other}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {lead.system.map((systemItem) => (
                    <TableRow key={systemItem.name}>
                        <TableCell>{systemItem.name}</TableCell>
                        <TableCell>
                            {numeral(systemItem.unitAmount).format(
                                `${systemItem.currencySymbol}0,0.00`
                            )}
                        </TableCell>
                        <TableCell>{systemItem.quantity}</TableCell>
                        <TableCell>
                            {numeral(systemItem.totalAmount).format(
                                `${systemItem.currencySymbol}0,0.00`
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell>Internal Price</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                        {numeral(lead.internalPrice).format(
                            `${lead.currencySymbol}0,0.00`
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Total Price</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                        {numeral(lead.totalPrice).format(
                            `${lead.currencySymbol}0,0.00`
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>STC Discount</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                        {numeral(lead.stcDiscount).format(
                            `${lead.currencySymbol}0,0.00`
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Final Price</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                        {numeral(lead.finalPrice).format(
                            `${lead.currencySymbol}0,0.00`
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Discount (%)</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                        {numeral(lead.discount).format(`00.00`)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

LeadSystemSummary.propTypes = {
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    lead: PropTypes.object,
};
