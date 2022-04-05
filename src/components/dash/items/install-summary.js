import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';

export const InstallSummary = (props) => {
  const { install, ...other } = props;

  return (
    <Scrollbar>
      <Table
        sx={{ minWidth: 500 }}
        {...other}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Cost
            </TableCell>
            <TableCell>
              Qty
            </TableCell>
            <TableCell>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {install.lineItems.map((lineItem) => (
            <TableRow key={lineItem.sku}>
              <TableCell>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Avatar
                    src={lineItem.image}
                    sx={{
                      height: 48,
                      mr: 2,
                      width: 48
                    }}
                    variant="rounded"
                  />
                  <div>
                    <Typography
                      color="textPrimary"
                      variant="body2"
                    >
                      {lineItem.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {`SKU: ${lineItem.sku}`}
                    </Typography>
                  </div>
                </Box>
              </TableCell>
              <TableCell>
                {numeral(lineItem.unitAmount).format(`${lineItem.currencySymbol}0,0.00`)}
              </TableCell>
              <TableCell>
                {lineItem.quantity}
              </TableCell>
              <TableCell>
                {numeral(lineItem.totalAmount).format(`${lineItem.currencySymbol}0,0.00`)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              Subtotal
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              {numeral(install.subtotalAmount).format(`${install.currencySymbol}0,0.00`)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              Discount (%)
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              {numeral(install.discountAmount).format(`${install.currencySymbol}0,0.00`)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              VAT (25%)
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              {numeral(install.taxAmount).format(`${install.currencySymbol}0,0.00`)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Total
              </Typography>
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {numeral(install.totalAmount).format(`${install.currencySymbol}0,0.00`)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Scrollbar>
  );
};

InstallSummary.propTypes = {
  error: PropTypes.object,
  isLoading: PropTypes.bool,
  install: PropTypes.object
};
