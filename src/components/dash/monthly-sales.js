import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/system';

const data = {
    series: [
        {
            name: 'Fred',
            data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
        },
        {
            name: 'Pedro',
            data: [35, 90, 40, 140, 390, 290, 340, 230, 300],
        },
        {
            name: 'Frank',
            data: [20, 90, 40, 140, 290, 290, 340, 230, 200],
        },
        {
            name: 'Joyce',
            data: [10, 90, 40, 140, 590, 290, 340, 230, 400],
        },
        {
            name: 'Eric',
            data: [10, 90, 40, 140, 450, 290, 340, 230, 100],
        },
    ],
};

export const MonthlySales = (props) => {
    const theme = useTheme();
    const chartOptions = {
        chart: {
            background: 'transparent',
            type: 'area',
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
            curve: 'smooth',
        },
        xaxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
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
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.8,
                gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
                inverseColors: true,
                opacityFrom: 0.9,
                opacityTo: 0.4,
                stops: [],
            },
            colors: ['#babbd8', '#989bc4', '#757bb1', '#515e9e', '#26428b'],
        },
        colors: ['#babbd8', '#989bc4', '#757bb1', '#515e9e', '#26428b'],
    };

    return (
        <Card variant="outlined" {...props}>
            <CardHeader title="Monthly Sales" />
            <Divider />
            <CardContent>
                <Grid container spacing={3} pb={5}></Grid>
                <Chart
                    height={400}
                    options={chartOptions}
                    series={data.series}
                    type="area"
                />
            </CardContent>
        </Card>
    );
};
