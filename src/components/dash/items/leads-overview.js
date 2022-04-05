import Chart from 'react-apexcharts';
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListSubheader,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/system';
import { StatusBadge } from '../../status-badge';
import { ActionsMenu } from '../../actions-menu';

const series = [
  {
    color: '#264653',
    data: 10,
    name: 'Fred'
  },
  {
    color: '#2a9d8f',
    data: 30,
    name: 'Pedro'
  },
  {
    color: '#e9c46a',
    data: 10,
    name: 'Frank'
  },
  {
    color: '#f4a261',
    data: 10,
    name: 'Joyce'
  },
  {
    color: '#e76f51',
    data: 40,
    name: 'Eric'
  }
];

export const OrdersOverview = (props) => {
  const theme = useTheme();
  const [range, setRange] = useState('This Week');

  const ranges = [
    {
      label: 'Last Month',
      onClick: () => { setRange('Last Month'); }
    },
    {
      label: 'Last Year',
      onClick: () => { setRange('Last Year'); }
    }
  ];
  const chartOptions = {
    chart: {
      background: 'transparent'
    },
    colors: series.map((item) => item.color),
    dataLabels: {
      enabled: false
    },
    labels: series.map((item) => item.name),
    legend: {
      show: false
    },
    stroke: {
      show: false
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = series.map((item) => item.data);

  return (
    <Card
      variant="outlined"
      {...props}
    >
      <CardHeader
        title="Leads Overview"
        sx={{
          py: 2.26
        }}
        action={(
          <ActionsMenu
            actions={ranges}
            label={range}
            size="small"
            variant="text"
          />
        )}
      />
      <Divider />
      <CardContent>
        <Chart
          height={164}
          options={chartOptions}
          series={chartSeries}
          type="donut"
        />
        <List>
          <ListSubheader
            disableGutters
            component="div"
            sx={{
              alignItems: 'center',
              display: 'flex',
              py: 1
            }}
          >
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Total Leads
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {series.reduce((acc, currentValue) => acc + currentValue.data, 0)}
            </Typography>
          </ListSubheader>
          <Divider />
          {series.map((item, index) => (
            <ListItem
              disableGutters
              divider={series.length > index + 1}
              key={item.name}
              sx={{ display: 'flex' }}
            >
              <StatusBadge
                color={item.color}
                sx={{ mr: 1 }}
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {item.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {item.data}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
