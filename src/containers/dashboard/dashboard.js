import { Suspense, lazy, useEffect, useState } from 'react';
import firebase from '../../lib/firebase';

import { LoadingScreen } from '../../components/loading-screen';

const Loadable = (Component) => (props) => (
    <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
    </Suspense>
);

// Dashboards
const AdminDashboard = Loadable(lazy(() => import('../../containers/dashboard/admin-dashboard').then((module) => ({ default: module.AdminDashboard }))));
const OperationsDashboard = Loadable(lazy(() => import('../../containers/dashboard/operations-dashboard').then((module) => ({ default: module.OperationsDashboard }))));
const SalesDashboard = Loadable(lazy(() => import('../../containers/dashboard/sales-dashboard').then((module) => ({ default: module.SalesDashboard }))));
const ManagerDashboard = Loadable(lazy(() => import('../../containers/dashboard/manager-dashboard').then((module) => ({ default: module.ManagerDashboard }))));
const SalesManagerDashboard = Loadable(lazy(() => import('../../containers/dashboard/sales-manager-dashboard').then((module) => ({ default: module.SalesManagerDashboard }))));
const FinanceDashboard = Loadable(lazy(() => import('../../containers/dashboard/finance-dashboard').then((module) => ({ default: module.FinanceDashboard }))));
const NotFound = Loadable(lazy(() => import('../../containers/not-found').then((module) => ({ default: module.NotFound }))));

export const Dashboard = () => {
    const defaultRoles = {
        admin: false,
        operations: false,
        sales: false,
        manager: false,
        salesManager: false,
        services: false,
        warehouse: false,
        finance: false
    }
    const [roles, setRoles] = useState(defaultRoles);

    useEffect(() => {
        firebase.auth().currentUser.getIdTokenResult()
            .then((idTokenResult) => {
                const userRoles = {
                    admin: idTokenResult.claims.roleAdmin,
                    operations: idTokenResult.claims.roleOperations,
                    sales: idTokenResult.claims.roleSales,
                    manager: idTokenResult.claims.roleManager,
                    salesManager: idTokenResult.claims.roleSalesManager,
                    services: idTokenResult.claims.roleServices,
                    warehouse: idTokenResult.claims.roleWarehouse,
                    finance: idTokenResult.claims.roleFinance
                };
                setRoles(userRoles);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    if(roles.admin) {
        return <AdminDashboard />
    } else if(roles.operations) {
        return <OperationsDashboard />
    } else if(roles.sales) {
        return <SalesDashboard />
    } else if(roles.manager) {
        return <ManagerDashboard />
    } else if(roles.salesManager) {
        return <SalesManagerDashboard />
    } else if(roles.finance) {
        return <FinanceDashboard />
    } else {
        return <NotFound />
    }
};
