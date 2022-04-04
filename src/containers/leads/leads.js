import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Divider, Typography } from '@mui/material';
import { bpmAPI } from '../../api/bpmAPI';
import { LeadsFilter } from '../../components/lead/leads-filter';
import { LeadStats } from '../../components/lead/lead-stats';
import { LeadsTable } from '../../components/lead/leads-table';
import { LeadCreateDialog } from '../../components/lead/lead-create-dialog';
import { useMounted } from '../../hooks/use-mounted';
import { useSelection } from '../../hooks/use-selection';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import toast from 'react-hot-toast';

export const Leads = () => {
  const mounted = useMounted();
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'create_date',
    view: 'all'
  });
  const [leadsState, setLeadsState] = useState({ isLoading: true });
  const [openCreateDialog, setOpenCreateDialog] = useState();
  const [
    selectedLeads,
    handleSelect,
    handleSelectAll
  ] = useSelection(leadsState.data?.invoices);

  const getData = useCallback(async () => {
    setLeadsState(() => ({ isLoading: true }));

    try {
      const result = await bpmAPI.getLeads({
        filters: controller.filters,
        page: controller.page,
        query: controller.query,
        sort: controller.sort,
        sortBy: controller.sortBy,
        view: controller.view
      });

      if (mounted.current) {
        setLeadsState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setLeadsState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [controller.filters, controller.page, controller.query, controller.sort, controller.sortBy, controller.view, mounted]);

  useEffect(() => {
    getData().catch(console.error);
  }, [controller, getData]);

  const handleViewChange = (newView) => {
    setController({
      ...controller,
      page: 0,
      view: newView
    });
  };

  const handleQueryChange = (newQuery) => {
    setController({
      ...controller,
      page: 0,
      query: newQuery
    });
  };

  const handleFiltersApply = (newFilters) => {
    const parsedFilters = newFilters.map((filter) => ({
      property: filter.property.name,
      value: filter.value,
      operator: filter.operator.value
    }));

    setController({
      ...controller,
      page: 0,
      filters: parsedFilters
    });
  };

  const handleFiltersClear = () => {
    setController({
      ...controller,
      page: 0,
      filters: []
    });
  };

  const handlePageChange = (newPage) => {
    setController({
      ...controller,
      page: newPage - 1
    });
  };

  const handleSortChange = (event, property) => {
    const isAsc = controller.sortBy === property && controller.sort === 'asc';

    setController({
      ...controller,
      page: 0,
      sort: isAsc ? 'desc' : 'asc',
      sortBy: property
    });
  };

  return (
    <>
      <Helmet>
        <title>Leads | Copower BPM</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box sx={{ py: 4 }}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Leads
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                size="large"
                startIcon={<AddOutlinedIcon fontSize="small" />}
                onClick={() => setOpenCreateDialog(true)}
                variant="contained"
              >
                Add
              </Button>
            </Box>
          </Box>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
            variant="outlined"
          >
            <LeadsFilter
              disabled={leadsState.isLoading}
              filters={controller.filters}
              onFiltersApply={handleFiltersApply}
              onFiltersClear={handleFiltersClear}
              onQueryChange={handleQueryChange}
              onViewChange={handleViewChange}
              query={controller.query}
              selectedLeads={selectedLeads}
              view={controller.view}
            />
            <Divider />
            <LeadsTable
              error={leadsState.error}
              leads={leadsState.data?.leads}
              leadsCount={leadsState.data?.leadsCount}
              isLoading={leadsState.isLoading}
              onPageChange={handlePageChange}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onSortChange={handleSortChange}
              page={controller.page + 1}
              selectedInvoices={selectedLeads}
              sort={controller.sort}
              sortBy={controller.sortBy}
            />
          </Card>
        </Container>
      </Box>
      <LeadCreateDialog
        onClose={() => setOpenCreateDialog(false)}
        open={openCreateDialog}
      />
    </>
  );
};
