import { Helmet } from 'react-helmet-async';
import { Notifications } from '../../components/dash/notifications';
import { SummaryItem } from '../../components/dash/summary-item';
import { YearTarget } from '../../components/dash/yearly-target';
import { WeeklySales } from '../../components/dash/weekly-sales';
import { MonthlySales } from '../../components/dash/monthly-sales';
import { YearlySales } from '../../components/dash/yearly-sales';
import { LeadsConversion } from '../../components/dash/leads-conversion';
import { LatestInstalls } from '../../components/dash/items/installs';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

import { Box, Container, Grid, Typography } from '@mui/material';

const stats = [
    {
        content: '50 KWs',
        icon: AnalyticsIcon,
        label: 'Sales this Week',
        linkHref: '#',
        linkLabel: 'Weekly Sales',
    },
    {
        content: '63 KWs',
        icon: AnalyticsIcon,
        label: 'Sales this Month',
        linkHref: '#',
        linkLabel: 'Monthly Sales',
    },
    {
        content: '10/15 - (66.67%)',
        icon: BusinessCenterIcon,
        label: 'New Leads this Week',
        linkHref: '#',
        linkLabel: 'Weekly Leads',
    },
    {
        content: '10/30 - (33.33%)',
        icon: BusinessCenterIcon,
        label: 'New Leads this Month',
        linkHref: '#',
        linkLabel: 'Monthly Leads',
    },
];

const latestInstalls = [
    {
        id: '5273',
        courier: 'DHL',
        createdAt: new Date('2021-06-02T14:32:45.475Z'),
        currency: 'USD',
        currencySymbol: '$',
        customer: {
            city: 'New York',
            country: 'USA',
            firstName: 'Devon',
            lastName: 'Lane',
        },
        discountAmount: 0,
        lineItems: [
            {
                currency: 'USD',
                currencySymbol: '$',
                discountAmount: 0,
                image: '/static/product-01.png',
                name: 'Watch with Leather Strap',
                quantity: 1,
                sku: 'BBAK01-A',
                subtotalAmount: 160,
                taxAmount: 32.5,
                totalAmount: 192.5,
                unitAmount: 160,
            },
        ],
        paymentId: 'ORIL8823',
        paymentMethod: 'debit',
        paymentStatus: 'paid',
        status: 'progress',
        trackingCode: 'KDO020021',
        totalAmount: 192.5,
        updatedAt: new Date('2021-06-02T14:32:45.475Z'),
    },
    {
        id: '9265',
        courier: 'DHL',
        createdAt: new Date('2021-05-12T20:10:45.475Z'),
        currency: 'USD',
        currencySymbol: '$',
        customer: {
            city: 'Berlin',
            country: 'Germany',
            firstName: 'Livia',
            lastName: 'Louthe',
        },
        discountAmount: 0,
        lineItems: [
            {
                currency: 'USD',
                currencySymbol: '$',
                discountAmount: 0,
                image: '/static/product-01.png',
                name: 'Watch with Leather Strap',
                quantity: 1,
                sku: 'BBAK01-A',
                subtotalAmount: 160,
                taxAmount: 32.5,
                totalAmount: 192.5,
                unitAmount: 160,
            },
        ],
        paymentId: 'L993DDLS',
        paymentMethod: 'paypal',
        paymentStatus: 'paid',
        status: 'complete',
        trackingCode: null,
        totalAmount: 631,
        updatedAt: new Date('2021-05-12T20:10:45.475Z'),
    },
    {
        id: '9266',
        courier: 'UPS',
        createdAt: new Date('2021-02-21T12:12:45.475Z'),
        currency: 'USD',
        currencySymbol: '$',
        customer: {
            city: 'Hamburg',
            country: 'Germany',
            firstName: 'Peri',
            lastName: 'Ottawell',
        },
        discountAmount: 0,
        lineItems: [
            {
                currency: 'USD',
                currencySymbol: '$',
                discountAmount: 0,
                image: '/static/product-01.png',
                name: 'Watch with Leather Strap',
                quantity: 1,
                sku: 'BBAK01-A',
                subtotalAmount: 160,
                taxAmount: 32.5,
                totalAmount: 192.5,
                unitAmount: 160,
            },
        ],
        paymentId: 'OPP482L',
        paymentMethod: 'creditCard',
        paymentStatus: 'paid',
        status: 'installer',
        totalAmount: 631,
        updatedAt: new Date('2021-02-21T12:12:45.475Z'),
    },
    {
        id: '1090',
        courier: 'UPS',
        createdAt: new Date('2021-09-09T10:10:45.475Z'),
        currency: 'USD',
        currencySymbol: '$',
        customer: {
            city: 'Madrid',
            country: 'Spain',
            firstName: 'Thadeus',
            lastName: 'Jacketts',
        },
        discountAmount: 0,
        lineItems: [
            {
                currency: 'USD',
                currencySymbol: '$',
                discountAmount: 0,
                image: '/static/product-01.png',
                name: 'Watch with Leather Strap',
                quantity: 1,
                sku: 'BBAK01-A',
                subtotalAmount: 160,
                taxAmount: 32.5,
                totalAmount: 192.5,
                unitAmount: 160,
            },
        ],
        paymentId: 'DZS194LD',
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        status: 'pending',
        trackingCode: null,
        totalAmount: 100,
        updatedAt: new Date('2021-09-09T10:10:45.475Z'),
    },
    {
        id: '1111',
        courier: 'Purolator',
        createdAt: new Date('2021-05-21T02:02:45.475Z'),
        currency: 'USD',
        currencySymbol: '$',
        customer: {
            city: 'Barcelona',
            country: 'Spain',
            firstName: 'Rad',
            lastName: 'Jose',
        },
        discountAmount: 0,
        lineItems: [
            {
                currency: 'USD',
                currencySymbol: '$',
                discountAmount: 0,
                image: '/static/product-01.png',
                name: 'Watch with Leather Strap',
                quantity: 1,
                sku: 'BBAK01-A',
                subtotalAmount: 160,
                taxAmount: 32.5,
                totalAmount: 192.5,
                unitAmount: 160,
            },
        ],
        paymentId: 'OTIK283L',
        paymentMethod: 'debit',
        paymentStatus: 'paid',
        status: 'pending',
        trackingCode: null,
        totalAmount: 60,
        updatedAt: new Date('2021-05-21T02:02:45.475Z'),
    },
];

export const ManagerDashboard = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ py: 2, backgroundColor: 'background.default' }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                py: 2,
                            }}
                        >
                            <Typography color="textPrimary" variant="h4">
                                Your Management Dashboard
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Notifications />
                            </Grid>
                            {stats.map((item) => (
                                <Grid item key={item.label} md={3} xs={16}>
                                    <SummaryItem
                                        content={item.content}
                                        icon={item.icon}
                                        label={item.label}
                                        linkHref={item.linkHref}
                                        linkLabel={item.linkLabel}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <YearTarget />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <WeeklySales />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <MonthlySales />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <YearlySales />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <LeadsConversion />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <LatestInstalls installs={latestInstalls} />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </>
    );
};
