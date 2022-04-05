import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/system';

const data = {
    series: [
        {
            name: 'Leads Percentage',
            data: [50, 40, 70, 80, 90],
        },
    ],
};

export const LeadsConversion = (props) => {
    const theme = useTheme();
    const chartOptions = {
        chart: {
            background: 'transparent',
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 1,
            colors: ['#fff'],
        },
        xaxis: {
            categories: ['Fred', 'Pedro', 'Frank', 'Joyce', 'Eric'],
            color: theme.palette.text.secondary,
            labels: {
                show: true,
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            show: true,
            color: '#fff',
            labels: {
                offsetX: -12,
                formatter: function (val) {
                    return val + '%';
                },
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '14px',
                },
            },
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            labels: {
                colors: theme.palette.text.secondary,
                useSeriesColors: false,
            },
        },
        grid: {
            borderColor: theme.palette.divider,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            opacity: 0.8,
        },
    };

    return (
        <Card variant="outlined" {...props}>
            <CardHeader title="Leads Conversion Rate" />
            <Divider />
            <CardContent>
                <Grid container spacing={3} pb={5}></Grid>
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
