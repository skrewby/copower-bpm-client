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
