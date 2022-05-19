import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Components
import { Loading } from './components/general/loading';

// Containers
import { BPMLayout } from './containers/bpm-layout';

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<Loading />}>
            <Component {...props} />
        </Suspense>
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

const routes = [
    {
        path: '/',
        element: <Navigate to="/bpm" replace />,
    },
    {
        path: 'bpm',
        element: <BPMLayout />,
        children: [
            {
                path: '',
                element: <Navigate to="/bpm/leads" replace />,
            },
            {
                path: 'leads',
                element: <Leads />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routes;
