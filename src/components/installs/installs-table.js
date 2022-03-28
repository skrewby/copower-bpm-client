import { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Box,
  Checkbox,
  Divider,
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { Pagination } from '../pagination';
import { ResourceError } from '../resource-error';
import { ResourceUnavailable } from '../resource-unavailable';
import { Status } from '../status';

const columns = [
  {
    id: 'reference',
    disablePadding: true,
    label: 'Reference'
  },
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'streetAddress',
    label: 'Address'
  },
  {
    id: 'contactNum',
    label: 'Phone'
  },
  {
    id: 'createdDate',
    label: 'Created'
  },
  {
    id: 'lastUpdated',
    label: 'Updated'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

const statusVariants = [
  {
    color: '#7680c4',
    label: 'New',
    value: 'new'
  },
  {
    color: '#c476c0',
    label: 'Deposit',
    value: 'deposit'
  },
  {
    color: '#c47683',
    label: 'PTC',
    value: 'ptc'
  },
  {
    color: '#bcc476',
    label: 'Schedule',
    value: 'schedule'
  },
  {
    color: '#c49176',
    label: 'Review',
    value: 'review'
  },
  {
    color: '#c47676',
    label: 'Payment',
    value: 'payment'
  },
  {
    color: '#87ab6f',
    label: 'Retailer',
    value: 'retailer'
  },
  {
    color: '#936fab',
    label: 'STC',
    value: 'stc'
  },
  {
    color: 'success.main',
    label: 'Complete',
    value: 'complete'
  }
];

export const InstallsTable = (props) => {
  const {
    error,
    installs: installsProp,
    installsCount,
    isLoading,
    onPageChange,
    onSelect,
    onSelectAll,
    onSortChange,
    page,
    selectedLeads,
    sort,
    sortBy
  } = props;
  const [installs, setLeads] = useState(installsProp);

  useEffect(() => {
    setLeads(installsProp);
  }, [installsProp]);

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !installs?.length);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
      }}
    >
      <Table sx={{ minWidth: 1000, height: 'fit-content' }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={installs.length > 0 && selectedLeads.length === installs.length}
                disabled={isLoading}
                indeterminate={selectedLeads.length > 0
                  && selectedLeads.length < installs.length}
                onChange={onSelectAll}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={sortBy === column.id}
                  direction={sortBy === column.id ? sort : 'asc'}
                  disabled={isLoading}
                  onClick={(event) => onSortChange(event, column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {installs.map((install) => {
            const statusVariant = statusVariants.find((variant) => variant.value
              === install.status);

            return (
              <TableRow
                hover
                key={install.id}
                selected={!!selectedLeads.find((selectedCustomer) => selectedCustomer
                  === install.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedLeads.find((selectedCustomer) => selectedCustomer
                      === install.id)}
                    onChange={(event) => onSelect(event, install.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    color="inherit"
                    component={RouterLink}
                    to="/bpm/installs/1"
                    underline="none"
                    variant="subtitle2"
                  >
                    {install.reference}
                  </Link>
                </TableCell>
                <TableCell>
                  {install.name}
                </TableCell>
                <TableCell>
                  {install.streetAddress}
                </TableCell>
                <TableCell>
                  {install.contactNum}
                </TableCell>
                <TableCell>
                  {format(install.createdDate, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  {format(install.updatedDate, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <Status
                    color={statusVariant.color}
                    label={statusVariant.label}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {displayLoading && (
        <Box sx={{ p: 2 }}>
          <Skeleton height={42} />
          <Skeleton height={42} />
          <Skeleton height={42} />
        </Box>
      )}
      {displayError && (
        <ResourceError
          error={error}
          sx={{
            flexGrow: 1,
            m: 2
          }}
        />
      )}
      {displayUnavailable && (
        <ResourceUnavailable
          sx={{
            flexGrow: 1,
            m: 2
          }}
        />
      )}
      <Divider sx={{ mt: 'auto' }} />
      <Pagination
        disabled={isLoading}
        onPageChange={onPageChange}
        page={page}
        rowsCount={installsCount}
      />
    </Box>
  );
};

InstallsTable.defaultProps = {
  installs: [],
  installsCount: 0,
  page: 1,
  selectedLeads: [],
  sort: 'desc',
  sortBy: 'createdDate'
};

InstallsTable.propTypes = {
  installs: Proptypes.array,
  leadsCount: Proptypes.number,
  error: Proptypes.string,
  isLoading: Proptypes.bool,
  onPageChange: Proptypes.func,
  onSelect: Proptypes.func,
  onSelectAll: Proptypes.func,
  onSortChange: Proptypes.func,
  page: Proptypes.number,
  selectedInvoices: Proptypes.array,
  sort: Proptypes.oneOf(['asc', 'desc']),
  sortBy: Proptypes.string
};
