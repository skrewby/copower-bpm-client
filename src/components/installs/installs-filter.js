import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Tab, Tabs } from '@mui/material';
import { Adjustments as AdjustmentsIcon } from '../../icons/adjustments';
import {
  containsOperator,
  endsWithOperator,
  equalOperator,
  greaterThanOperator,
  isAfterOperator,
  isBeforeOperator,
  isBlankOperator,
  isPresentOperator,
  lessThanOperator,
  notContainsOperator,
  notEqualOperator,
  startsWithOperator
} from '../../utils/filter-operators';
import { BulkActionsMenu } from '../bulk-actions-menu';
import { Query } from '../query';
import { FilterDialog } from '../filter-dialog';

const views = [
  {
    label: 'Show all',
    value: 'all'
  },
  {
    label: 'Awaiting Deposit',
    value: 'deposit'
  },
  {
    label: 'PTC',
    value: 'ptc'
  },
  {
    label: 'Schedule',
    value: 'schedule'
  },
  {
    label: 'Review',
    value: 'review'
  },
  {
    label: 'Awaiting Payment',
    value: 'payment'
  },
  {
    label: 'Retailer Notification',
    value: 'retailer'
  },
  {
    label: 'STC',
    value: 'stc'
  },
  {
    label: 'Complete',
    value: 'complete'
  },
  {
    label: 'Cancelled',
    value: 'cancelled'
  }
];

const filterProperties = [
  {
    label: 'Created Date',
    name: 'createdDate',
    type: 'date'
  },
  {
    label: 'Last Updated',
    name: 'updatedDate',
    type: 'date'
  },
  {
    label: 'Status',
    name: 'status',
    type: 'string'
  },
  {
    label: 'Install Date',
    name: 'installDate',
    type: 'date'
  }
];

const filterOperators = [
  equalOperator,
  notEqualOperator,
  containsOperator,
  notContainsOperator,
  startsWithOperator,
  endsWithOperator,
  greaterThanOperator,
  lessThanOperator,
  isAfterOperator,
  isBeforeOperator,
  isBlankOperator,
  isPresentOperator
];

export const InstallsFilter = (props) => {
  const {
    disabled,
    filters,
    onFiltersApply,
    onFiltersClear,
    onQueryChange,
    onViewChange,
    query,
    selectedLeads,
    view
  } = props;
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  return (
    <>
      <div>
        <Box
          sx={{
            px: {
              sm: 3
            }
          }}
        >
          <Tabs
            onChange={(event, value) => onViewChange?.(value)}
            allowScrollButtonsMobile
            value={view}
            variant="scrollable"
          >
            {views.map((option) => (
              <Tab
                disabled={disabled}
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
              sm: selectedLeads.length > 0 ? 'auto 1fr auto' : '1fr auto',
              xs: 'auto'
            },
            justifyItems: 'flex-start',
            p: 3
          }}
        >
          <BulkActionsMenu
            disabled={disabled}
            onArchive={() => { }}
            onDelete={() => { }}
            selectedCount={selectedLeads.length}
            sx={{
              display: selectedLeads.length > 0 ? 'flex' : 'none',
              order: {
                sm: 1,
                xs: 2
              }
            }}
          />
          <Query
            disabled={disabled}
            onChange={onQueryChange}
            sx={{
              order: {
                sm: 2,
                xs: 1
              }
            }}
            value={query}
          />
          <Button
            color="primary"
            disabled={disabled}
            onClick={() => setOpenFilterDialog(true)}
            startIcon={<AdjustmentsIcon />}
            size="large"
            sx={{ order: 3 }}
            variant={filters.length ? 'contained' : 'text'}
          >
            Filter
          </Button>
        </Box>
      </div>
      <FilterDialog
        onApply={onFiltersApply}
        onClear={onFiltersClear}
        onClose={() => setOpenFilterDialog(false)}
        open={openFilterDialog}
        operators={filterOperators}
        properties={filterProperties}
      />
    </>
  );
};

InstallsFilter.defaultProps = {
  filters: [],
  selectedInvoices: [],
  view: 'all'
};

InstallsFilter.propTypes = {
  disabled: PropTypes.bool,
  filters: PropTypes.array,
  onFiltersApply: PropTypes.func,
  onFiltersClear: PropTypes.func,
  onQueryChange: PropTypes.func,
  onViewChange: PropTypes.func,
  query: PropTypes.string,
  selectedInvoices: PropTypes.array,
  view: PropTypes.string
};
