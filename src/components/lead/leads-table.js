import { useEffect, useState } from 'react';
import Proptypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
    id: 'lead_id',
    label: 'ID'
  },
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'address',
    label: 'Address'
  },
  {
    id: 'sales',
    label: 'Assigned Sales'
  },
  {
    id: 'source',
    label: 'Source'
  },
  {
    id: 'create_date',
    label: 'Created'
  },
  {
    id: 'last_updated',
    label: 'Last Updated'
  },
  {
    id: 'status',
    label: 'Status'
  }
];

export const LeadsTable = (props) => {
  const {
    error,
    leads: leadsProp,
    leadsCount,
    isLoading,
    onPageChange,
    onSortChange,
    page,
    sort,
    sortBy
  } = props;
  const [leads, setLeads] = useState(leadsProp);
  let navigate = useNavigate();

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
            return (
              <TableRow
                hover
                key={lead.lead_id}
                onClick={() => { navigate(`/bpm/leads/${lead.lead_id}`); }}
              >
                <TableCell>
                  {lead.lead_id}
                </TableCell>
                <TableCell>
                  {lead.name}
                </TableCell>
                <TableCell>
                  {lead.address}
                </TableCell>
                <TableCell>
                  {lead.sales}
                </TableCell>
                <TableCell>
                  {lead.source}
                </TableCell>
                <TableCell>
                  {format(lead.create_date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  {format(lead.last_updated, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <Status
                    color={lead.status_colour}
                    label={lead.status}
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
        rowsCount={leadsCount}
      />
    </Box>
  );
};

LeadsTable.defaultProps = {
  leads: [],
  leadsCount: 0,
  page: 1,
  sort: 'desc',
  sortBy: 'id'
};

LeadsTable.propTypes = {
  leads: Proptypes.array,
  leadsCount: Proptypes.number,
  error: Proptypes.string,
  isLoading: Proptypes.bool,
  onPageChange: Proptypes.func,
  onSortChange: Proptypes.func,
  page: Proptypes.number,
  selectedInvoices: Proptypes.array,
  sort: Proptypes.oneOf(['asc', 'desc']),
  sortBy: Proptypes.string
};
