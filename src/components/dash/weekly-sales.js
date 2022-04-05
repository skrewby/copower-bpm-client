import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/system';

const data = {
  series: [
    {
      name: "KWs",
      data: [50, 40, 70, 100, 90],
    },
  ]
};

export const WeeklySales = (props) => {
  const theme = useTheme();
  const chartOptions ={
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        horizontal: false,
        columnWidth: "50px",
      }
    },
    xaxis: {
      categories: ["Fred", "Pedro", "Frank", "Joyce", "Eric"],
      color: theme.palette.text.secondary,
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      show: true,
      color: theme.palette.text.secondary,
      labels: {
        offsetX: -12,
        formatter: function (val) {
          return val + "KW"
        },
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "14px",
        },
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "KW"
        }
      },
      style: {
        backgroundColor: "red",
        fontSize: "12px",
      },
      onDatasetHover: {
        style: {
          backgroundColor: "red",
          fontSize: "12px",
        },
      },
      theme: {
        mode: theme.palette.mode
      },
    },
    fill: {
      opacity: 1
    },
    colors: ['rgba(6, 70, 153, 1)'],
    dataLabels: {
      formatter: function (val, opt) {
        const goals =
          opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
            .goals
  
        if (goals && goals.length) {
          return `${val} / ${goals[0].value}`
        }
        return val
      }
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ['Sales'],
      markers: {
        fillColors: ['rgba(6, 70, 153, 1)']
      },
      labels: {
        colors: theme.palette.text.secondary,
        useSeriesColors: false
      },
    }
  };

  return (
    <Card
      variant="outlined"
      {...props}
    >
      <CardHeader
        title="Weekly Sales"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={3}
          pb= {5}
        >
        </Grid>
        <Chart
          height={400}
          options={chartOptions}
          series={data.series}
          type="bar"
        />
      </CardContent>
    </Card>
  );
};
