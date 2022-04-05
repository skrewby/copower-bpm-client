import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/system';

const data = {
    series: [
        {
            name: 'Jan',
            data: [40, 55, 41, 37, 22],
        },
        {
            name: 'Feb',
            data: [53, 32, 33, 52, 13],
        },
        {
            name: 'Mar',
            data: [12, 17, 11, 9, 15],
        },
        {
            name: 'Apr',
            data: [9, 7, 5, 8, 6],
        },
        {
            name: 'May',
            data: [25, 12, 19, 32, 25],
        },
        {
            name: 'Jun',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: 'Jul',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: 'Aug',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: 'Sep',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: 'Oct',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: 'Nov',
            data: [0, 0, 0, 0, 0],
        },
        {
            name: 'Dec',
            data: [0, 0, 0, 0, 0],
        },
    ],
};

export const YearlySales = (props) => {
    const theme = useTheme();
    const chartOptions = {
        chart: {
            background: 'transparent',
            type: 'bar',
            stacked: true,
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
                    return val + 'KW';
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
            <CardHeader title="Yearly Sales" />
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
