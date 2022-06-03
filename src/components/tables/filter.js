import { useState } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Box, Button, Divider, Tab, Tabs } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// Local import
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
import { Query } from './query';
import { FilterDialog } from './filter-dialog';

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

export const Filter = (props) => {
    const {
        disabled,
        filters,
        onFiltersApply,
        onFiltersClear,
        onQueryChange,
        onViewChange,
        query,
        view,
        views,
        filterProperties,
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
                        startIcon={<SettingsIcon />}
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

Filter.defaultProps = {
    filters: [],
    view: 'all',
};

Filter.propTypes = {
    disabled: PropTypes.bool,
    filters: PropTypes.array,
    onFiltersApply: PropTypes.func,
    onFiltersClear: PropTypes.func,
    onQueryChange: PropTypes.func,
    onViewChange: PropTypes.func,
    query: PropTypes.string,
    view: PropTypes.string,
    views: PropTypes.array,
    filterProperties: PropTypes.array,
};
