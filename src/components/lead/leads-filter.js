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
    startsWithOperator,
} from '../../utils/filter-operators';
import { BulkActionsMenu } from '../bulk-actions-menu';
import { Query } from '../query';
import { FilterDialog } from '../filter-dialog';

const views = [
    {
        label: 'Show all',
        value: 'all',
    },
    {
        label: 'New',
        value: 'New',
    },
    {
        label: 'Attempting Contact',
        value: 'Attempting Contact',
    },
    {
        label: 'Park',
        value: 'Park',
    },
    {
        label: 'Quotation',
        value: 'Quotation',
    },
    {
        label: 'Review',
        value: 'Review',
    },
    {
        label: 'Rejected - Pending',
        value: 'Rejected - Pending',
    },
    {
        label: 'Rejected',
        value: 'Rejected',
    },
    {
        label: 'Closed',
        value: 'Closed',
    },
    {
        label: 'Win',
        value: 'Win',
    },
];

const filterProperties = [
    {
        label: 'Created Date',
        name: 'createdDate',
        type: 'date',
    },
    {
        label: 'Last Updated',
        name: 'updatedDate',
        type: 'date',
    },
    {
        label: 'Sales',
        name: 'sales',
        type: 'string',
    },
    {
        label: 'Status',
        name: 'status',
        type: 'string',
    },
    {
        label: 'Source',
        name: 'source',
        type: 'string',
    },
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
    isPresentOperator,
];

export const LeadsFilter = (props) => {
    const {
        disabled,
        filters,
        onFiltersApply,
        onFiltersClear,
        onQueryChange,
        onViewChange,
        query,
        view,
    } = props;
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    return (
        <>
            <div>
                <Box
                    sx={{
                        px: {
                            sm: 3,
                        },
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
                            sm: '1fr auto',
                            xs: 'auto',
                        },
                        justifyItems: 'flex-start',
                        p: 3,
                    }}
                >
                    <Query
                        disabled={disabled}
                        onChange={onQueryChange}
                        sx={{
                            order: {
                                sm: 2,
                                xs: 1,
                            },
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

LeadsFilter.defaultProps = {
    filters: [],
    view: 'all',
};

LeadsFilter.propTypes = {
    disabled: PropTypes.bool,
    filters: PropTypes.array,
    onFiltersApply: PropTypes.func,
    onFiltersClear: PropTypes.func,
    onQueryChange: PropTypes.func,
    onViewChange: PropTypes.func,
    query: PropTypes.string,
    view: PropTypes.string,
};
