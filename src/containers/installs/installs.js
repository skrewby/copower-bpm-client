import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Divider, Typography } from '@mui/material';
import { installApi } from '../../api/install';
import { InstallsFilter } from '../../components/installs/installs-filter';
import { InstallsTable } from '../../components/installs/installs-table';
import { useMounted } from '../../hooks/use-mounted';
import { useSelection } from '../../hooks/use-selection';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import toast from 'react-hot-toast';

export const Installs = () => {
  const mounted = useMounted();
  const [controller, setController] = useState({
    filters: [],
    page: 0,
    query: '',
    sort: 'desc',
    sortBy: 'createdDate',
    view: 'all'
  });
  const [installsState, setInstallsState] = useState({ isLoading: true });
  const [
    selectedInstalls,
    handleSelect,
    handleSelectAll
  ] = useSelection(installsState.data?.invoices);

  const getData = useCallback(async () => {
    setInstallsState(() => ({ isLoading: true }));

    try {
      const result = await installApi.getInstalls({
        filters: controller.filters,
        page: controller.page,
        query: controller.query,
        sort: controller.sort,
        sortBy: controller.sortBy,
        view: controller.view
      });

      if (mounted.current) {
        setInstallsState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setInstallsState(() => ({
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

  const handleCreateInstall = () => {
    toast.error("Not implemented yet");
  };

  return (
    <>
      <Helmet>
        <title>Installs | Copower BPM</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      >
        <Container
          maxWidth="lg"
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
                Installs
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                size="large"
                startIcon={<AddOutlinedIcon fontSize="small" />}
                onClick={handleCreateInstall}
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
            <InstallsFilter
              disabled={installsState.isLoading}
              filters={controller.filters}
              onFiltersApply={handleFiltersApply}
              onFiltersClear={handleFiltersClear}
              onQueryChange={handleQueryChange}
              onViewChange={handleViewChange}
              query={controller.query}
              selectedInstalls={selectedInstalls}
              view={controller.view}
            />
            <Divider />
            <InstallsTable
              error={installsState.error}
              installs={installsState.data?.installs}
              installsCount={installsState.data?.installsCount}
              isLoading={installsState.isLoading}
              onPageChange={handlePageChange}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onSortChange={handleSortChange}
              page={controller.page + 1}
              selectedInvoices={selectedInstalls}
              sort={controller.sort}
              sortBy={controller.sortBy}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};
