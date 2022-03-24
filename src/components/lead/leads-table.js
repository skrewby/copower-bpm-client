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
import { InvoiceMenu } from './invoice-menu';

const columns = [
  {
    id: 'refID',
    disablePadding: true,
    label: 'Reference'
  },
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'sales',
    label: 'Assigned Sales'
  },
  {
    id: 'createdDate',
    label: 'Created'
  },
  {
    id: 'updatedDate',
    label: 'Last Updated'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

const statusVariants = [
  {
    color: 'info.main',
    label: 'New',
    value: 'New'
  },
  {
    color: 'warning.main',
    label: 'Rejected',
    value: 'Rejected'
  },
  {
    color: 'error.main',
    label: 'Closed',
    value: 'Closed'
  },
  {
    color: 'success.main',
    label: 'Win',
    value: 'Win'
  }
];

export const LeadsTable = (props) => {
  const {
    error,
    leads: leadsProp,
    leadsCount,
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
  const [leads, setLeads] = useState(leadsProp);

  useEffect(() => {
    setLeads(leadsProp);
  }, [leadsProp]);

  const displayLoading = isLoading;
  const displayError = Boolean(!isLoading && error);
  const displayUnavailable = Boolean(!isLoading && !error && !leads?.length);

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
                checked={leads.length > 0 && selectedLeads.length === leads.length}
                disabled={isLoading}
                indeterminate={selectedLeads.length > 0
                  && selectedLeads.length < leads.length}
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
          {leads.map((lead) => {
            const statusVariant = statusVariants.find((variant) => variant.value
              === lead.status);

            return (
              <TableRow
                hover
                key={lead.id}
                selected={!!selectedLeads.find((selectedCustomer) => selectedCustomer
                  === lead.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedLeads.find((selectedCustomer) => selectedCustomer
                      === lead.id)}
                    onChange={(event) => onSelect(event, lead.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    color="inherit"
                    component={RouterLink}
                    to="/bpm/leads/1"
                    underline="none"
                    variant="subtitle2"
                  >
                    {lead.refID}
                  </Link>
                </TableCell>
                <TableCell>
                  {lead.name}
                </TableCell>
                <TableCell>
                  {lead.sales}
                </TableCell>
                <TableCell>
                  {format(lead.createdDate, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  {format(lead.updatedDate, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <Status
                    color={statusVariant.color}
                    label={statusVariant.label}
                  />
                </TableCell>
                <TableCell>
                  <InvoiceMenu />
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
        rowsCount={leadsCount}
      />
    </Box>
  );
};

LeadsTable.defaultProps = {
  leads: [],
  leadsCount: 0,
  page: 1,
  selectedLeads: [],
  sort: 'desc',
  sortBy: 'createdDate'
};

LeadsTable.propTypes = {
  leads: Proptypes.array,
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
