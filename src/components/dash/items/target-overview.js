import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useTheme } from '@mui/system';

const series = [67];

export const TargetsOverview = (props) => {
    const theme = useTheme();

    const chartOptions = {
        chart: {
            type: 'radialBar',
            background: 'transparent',
        },
        colors: ['#2a9d8f'],
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#1d3557',
                },
                track: {
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        blur: 4,
                        opacity: 0.15,
                        background: '#f4a261',
                    },
                },
                dataLabels: {
                    name: {
                        offsetY: -10,
                        color: '#fff',
                        fontSize: '20px',
                    },
                    value: {
                        color: '#fff',
                        fontSize: '25px',
                        show: true,
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        type: 'vertical',
                        gradientToColors: ['#87D4F9'],
                        stops: [0, 100],
                    },
                },
                stroke: {
                    lineCap: 'round',
                },

                theme: {
                    mode: theme.palette.mode,
                },
            },
        },
        labels: ['Progress'],
    };

    return (
        <Card variant="outlined" {...props}>
            <CardHeader
                title="Target Overview - 10/15 KW"
                sx={{
                    py: 2.26,
                }}
            />
            <Divider />
            <CardContent>
                <Chart
                    height={340}
                    options={chartOptions}
                    series={series}
                    type="radialBar"
                />
            </CardContent>
        </Card>
    );
};
