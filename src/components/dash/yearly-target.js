import Chart from 'react-apexcharts';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/system';

const stats = [
    {
        content: '139 KW',
        label: 'Company Current',
    },
    {
        content: '123 KW',
        label: 'Company Target',
    },
    {
        content: '109 KW',
        label: 'Company Week',
    },
    {
        content: '138 KW',
        label: 'Compmay Month',
    },
    {
        content: '81 KW',
        label: 'Company Year',
    },
];

const data = {
    series: [
        {
            name: 'Actual',
            data: [
                {
                    x: 'Fred',
                    y: 139,
                    goals: [
                        {
                            name: 'Expected',
                            value: 500,
                            strokeWidth: 25,
                            strokeHeight: 3,
                            strokeLineCap: 'round',
                            strokeColor: 'rgba(49, 129, 237, 1)',
                        },
                    ],
                },
                {
                    x: 'Pedro',
                    y: 123,
                    goals: [
                        {
                            name: 'Expected',
                            value: 600,
                            strokeWidth: 25,
                            strokeHeight: 3,
                            strokeLineCap: 'round',
                            strokeColor: 'rgba(49, 129, 237, 1)',
                        },
                    ],
                },
                {
                    x: 'Frank',
                    y: 109,
                    goals: [
                        {
                            name: 'Expected',
                            value: 520,
                            strokeWidth: 25,
                            strokeHeight: 3,
                            strokeLineCap: 'round',
                            strokeColor: 'rgba(49, 129, 237, 1)',
                        },
                    ],
                },
                {
                    x: 'Joyce',
                    y: 138,
                    goals: [
                        {
                            name: 'Expected',
                            value: 500,
                            strokeWidth: 25,
                            strokeHeight: 3,
                            strokeLineCap: 'round',
                            strokeColor: 'rgba(49, 129, 237, 1)',
                        },
                    ],
                },
                {
                    x: 'Eric',
                    y: 81,
                    goals: [
                        {
                            name: 'Expected',
                            value: 70,
                            strokeWidth: 25,
                            strokeHeight: 3,
                            strokeLineCap: 'round',
                            strokeColor: 'rgba(49, 129, 237, 1)',
                        },
                    ],
                },
            ],
        },
    ],
};

export const YearTarget = (props) => {
    const theme = useTheme();

    const chartOptions = {
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
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                horizontal: false,
                columnWidth: '50px',
            },
        },
        xaxis: {
            color: theme.palette.text.secondary,
            labels: {
                show: true,
                style: {
                    colors: theme.palette.text.secondary,
                    fontSize: '14px',
                },
            },
        },
        yaxis: {
            show: true,
            color: theme.palette.text.secondary,
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
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + 'KW';
                },
            },
            style: {
                backgroundColor: 'red',
                fontSize: '12px',
            },
            onDatasetHover: {
                style: {
                    backgroundColor: 'red',
                    fontSize: '12px',
                },
            },
            theme: {
                mode: theme.palette.mode,
            },
        },
        fill: {
            opacity: 1,
        },
        colors: ['rgba(6, 70, 153, 1)', 'rgba(49, 129, 237, 1)'],
        dataLabels: {
            formatter: function (val, opt) {
                const goals =
                    opt.w.config.series[opt.seriesIndex].data[
                        opt.dataPointIndex
                    ].goals;

                if (goals && goals.length) {
                    return `${val} / ${goals[0].value}`;
                }
                return val;
            },
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Actual', 'Expected'],
            markers: {
                fillColors: ['rgba(6, 70, 153, 1)', 'rgba(49, 129, 237, 1)'],
            },
            labels: {
                colors: theme.palette.text.secondary,
                useSeriesColors: false,
            },
        },
    };

    return (
        <Card variant="outlined" {...props}>
            <CardHeader title="Sales Yearly Target" />
            <Divider />
            <CardContent>
                <Grid container spacing={3} pb={5}>
                    {stats.map((item) => (
                        <Grid item key={item.label} md={2.4} sm={6} xs={12}>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'neutral.100',
                                    borderRadius: 1,
                                    p: 2,
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    variant="overline"
                                >
                                    {item.label}
                                </Typography>
                                <Typography color="textPrimary" variant="h6">
                                    {item.content}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
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
