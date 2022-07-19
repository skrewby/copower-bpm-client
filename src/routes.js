import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Components
import { Loading } from './components/general/loading';
import { AuthGuard } from './components/auth/auth-guard';
import { GuestGuard } from './components/auth/guest-guard';

// Containers
import { BPMLayout } from './containers/bpm-layout';

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<Loading />}>
            <Component {...props} />
        </Suspense>
    );

// Auth pages
const Login = Loadable(
    lazy(() =>
        import('./containers/auth/login').then((module) => ({
            default: module.Login,
        }))
    )
);

// BPM pages
const NotFound = Loadable(
    lazy(() =>
        import('./containers/not-found').then((module) => ({
            default: module.NotFound,
        }))
    )
);
const Leads = Loadable(
    lazy(() =>
        import('./containers/leads/leads').then((module) => ({
            default: module.Leads,
        }))
    )
);
const Lead = Loadable(
    lazy(() =>
        import('./containers/leads/lead').then((module) => ({
            default: module.Lead,
        }))
    )
);
const LeadSummary = Loadable(
    lazy(() =>
        import('./containers/leads/lead-summary').then((module) => ({
            default: module.LeadSummary,
        }))
    )
);
const LeadFinance = Loadable(
    lazy(() =>
        import('./containers/leads/lead-finance').then((module) => ({
            default: module.LeadFinance,
        }))
    )
);
const LeadLog = Loadable(
    lazy(() =>
        import('./containers/leads/lead-log').then((module) => ({
            default: module.LeadLog,
        }))
    )
);
const Organisation = Loadable(
    lazy(() =>
        import('./containers/organisation/organisation').then((module) => ({
            default: module.Organisation,
        }))
    )
);
const OrganisationMembers = Loadable(
    lazy(() =>
        import('./containers/organisation/organisation-members').then(
            (module) => ({
                default: module.OrganisationMembers,
            })
        )
    )
);
const Installs = Loadable(
    lazy(() =>
        import('./containers/installs/installs').then((module) => ({
            default: module.Installs,
        }))
    )
);
const Install = Loadable(
    lazy(() =>
        import('./containers/installs/install').then((module) => ({
            default: module.Install,
        }))
    )
);
const InstallSummary = Loadable(
    lazy(() =>
        import('./containers/installs/install-summary').then((module) => ({
            default: module.InstallSummary,
        }))
    )
);
const InstallMeter = Loadable(
    lazy(() =>
        import('./containers/installs/install-meter').then((module) => ({
            default: module.InstallMeter,
        }))
    )
);
const InstallFinance = Loadable(
    lazy(() =>
        import('./containers/installs/install-finance').then((module) => ({
            default: module.InstallFinance,
        }))
    )
);
const InstallSchedule = Loadable(
    lazy(() =>
        import('./containers/installs/install-schedule').then((module) => ({
            default: module.InstallSchedule,
        }))
    )
);
const InstallLogs = Loadable(
    lazy(() =>
        import('./containers/installs/install-log').then((module) => ({
            default: module.InstallLog,
        }))
    )
);
const Customers = Loadable(
    lazy(() =>
        import('./containers/customers/customers').then((module) => ({
            default: module.Customers,
        }))
    )
);
const Customer = Loadable(
    lazy(() =>
        import('./containers/customers/customer').then((module) => ({
            default: module.Customer,
        }))
    )
);
const CustomerSummary = Loadable(
    lazy(() =>
        import('./containers/customers/customer-summary').then((module) => ({
            default: module.CustomerSummary,
        }))
    )
);
const Account = Loadable(
    lazy(() =>
        import('./containers/account/account').then((module) => ({
            default: module.Account,
        }))
    )
);
const Calendar = Loadable(
    lazy(() =>
        import('./containers/calendar').then((module) => ({
            default: module.Calendar,
        }))
    )
);
const Stock = Loadable(
    lazy(() =>
        import('./containers/stock/stock').then((module) => ({
            default: module.Stock,
        }))
    )
);
const StockItems = Loadable(
    lazy(() =>
        import('./containers/stock/stock-items').then((module) => ({
            default: module.StockItems,
        }))
    )
);

const routes = [
    {
        path: '/',
        element: <Navigate to="/bpm" replace />,
    },
    {
        path: 'login',
        element: (
            <GuestGuard>
                <Login />
            </GuestGuard>
        ),
    },
    {
        path: 'bpm',
        element: (
            <AuthGuard>
                <BPMLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: '',
                element: <Navigate to="/bpm/leads" replace />,
            },
            {
                path: 'calendar',
                element: <Calendar />,
            },
            {
                path: 'leads',
                children: [
                    {
                        path: '',
                        element: <Leads />,
                    },
                    {
                        path: ':leadID',
                        element: <Lead />,
                        children: [
                            {
                                path: '',
                                element: <LeadSummary />,
                            },
                            {
                                path: 'finance',
                                element: <LeadFinance />,
                            },
                            {
                                path: 'log',
                                element: <LeadLog />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'installs',
                children: [
                    {
                        path: '',
                        element: <Installs />,
                    },
                    {
                        path: ':installID',
                        element: <Install />,
                        children: [
                            {
                                path: '',
                                element: <InstallSummary />,
                            },
                            {
                                path: 'meter',
                                element: <InstallMeter />,
                            },
                            {
                                path: 'schedule',
                                element: <InstallSchedule />,
                            },
                            {
                                path: 'finance',
                                element: <InstallFinance />,
                            },
                            {
                                path: 'log',
                                element: <InstallLogs />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'customers',
                children: [
                    {
                        path: '',
                        element: <Customers />,
                    },
                    {
                        path: ':customerID',
                        element: <Customer />,
                        children: [
                            {
                                path: '',
                                element: <CustomerSummary />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'stock',
                element: <Stock />,
                children: [
                    {
                        path: '',
                        element: <StockItems />,
                    },
                ],
            },
            {
                path: 'organisation',
                element: <Organisation />,
                children: [
                    {
                        path: '',
                        element: <OrganisationMembers />,
                    },
                ],
            },
            {
                path: 'account',
                element: <Account />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routes;
