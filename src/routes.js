import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Components
import { LoadingScreen } from './components/loading-screen';
import { AuthGuard } from './components/auth/auth-guard';
import { GuestGuard } from './components/auth/guest-guard';

// Containers
import { BPMLayout } from './containers/bpm-layout';

const Loadable = (Component) => (props) => (
    <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
    </Suspense>
);

// Auth pages
const Login = Loadable(lazy(() => import('./containers/auth/login').then((module) => ({ default: module.Login }))));
const PasswordRecovery = Loadable(lazy(() => import('./containers/auth/password-recovery').then((module) => ({ default: module.PasswordRecovery }))));

// BPM pages
const NotFound = Loadable(lazy(() => import('./containers/not-found').then((module) => ({ default: module.NotFound }))));
const Dashboard = Loadable(lazy(() => import('./containers/dashboard/dashboard').then((module) => ({ default: module.Dashboard }))));

const Leads = Loadable(lazy(() => import('./containers/leads/leads').then((module) => ({ default: module.Leads }))));
const Lead = Loadable(lazy(() => import('./containers/leads/lead').then((module) => ({ default: module.Lead }))));

const routes = [
    {
        path: '/',
        element: (
            <Navigate
                to="/bpm"
                replace
            />
        ),
    },
    {
        path: 'login',
        element: (
            <GuestGuard>
                <Login />
            </GuestGuard>
        )
    },
    {
        path: 'password-recovery',
        element: (
            <GuestGuard>
                <PasswordRecovery />
            </GuestGuard>
        )
    },
    {
        path: "bpm",
        element: (
            <AuthGuard>
                <BPMLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: '',
                element: (
                    <Navigate
                        to="/bpm/dashboard"
                        replace
                    />
                )
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'leads',
                children: [
                    {
                        path: '',
                        element: <Leads />
                    },
                    {
                        path: ':orderId',
                        element: <Lead />
                    }
                ]
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default routes;
