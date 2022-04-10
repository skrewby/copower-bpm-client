import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Components
import { LoadingScreen } from './components/loading-screen';
import { AuthGuard } from './components/auth/auth-guard';
import { GuestGuard } from './components/auth/guest-guard';

// Containers
import { BPMLayout } from './containers/bpm-layout';

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<LoadingScreen />}>
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
const PasswordRecovery = Loadable(
    lazy(() =>
        import('./containers/auth/password-recovery').then((module) => ({
            default: module.PasswordRecovery,
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
const Dashboard = Loadable(
    lazy(() =>
        import('./containers/dashboard/dashboard').then((module) => ({
            default: module.Dashboard,
        }))
    )
);
const Calendar = Loadable(
    lazy(() =>
        import('./containers/office-calendar').then((module) => ({
            default: module.ViewCalendar,
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
const LeadQuotation = Loadable(
    lazy(() =>
        import('./containers/leads/lead-quotation').then((module) => ({
            default: module.LeadQuotation,
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
        path: 'password-recovery',
        element: (
            <GuestGuard>
                <PasswordRecovery />
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
                element: <Navigate to="/bpm/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
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
                                path: 'quotation',
                                element: <LeadQuotation />,
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
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routes;
