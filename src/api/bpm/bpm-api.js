// API imports
import { login, logout } from './auth';
import {
    getLeads,
    getLead,
    createLeadLog,
    getLeadLogs,
    updateLead,
    createLead,
} from './leads';
import {
    changePassword,
    createUser,
    getCurrentUser,
    getUsers,
    updateCurrentUser,
    updateUser,
} from './users';
import {
    getExistingSystemOptions,
    getInstallStatusOptions,
    getLeadSources,
    getLeadStatusOptions,
    getPhaseOptions,
    getRoofPitchOptions,
    getRoofTypeOptions,
    getStoryOptions,
    getValidRoles,
} from './info';
import {
    getInstalls,
    getInstall,
    createInstallLog,
    getInstallLogs,
    updateInstall,
    createInstall,
} from './installs';
import {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    createCustomerLog,
    getCustomerLogs,
    searchCustomer,
} from './customers';
import { getInstallers } from './installers';

class API {}

// Auth
API.prototype.login = login;
API.prototype.logout = logout;

// Leads
API.prototype.getLeads = getLeads;
API.prototype.getLead = getLead;
API.prototype.createLeadLog = createLeadLog;
API.prototype.getLeadLogs = getLeadLogs;
API.prototype.updateLead = updateLead;
API.prototype.createLead = createLead;

// Installs
API.prototype.getInstalls = getInstalls;
API.prototype.getInstall = getInstall;
API.prototype.createInstallLog = createInstallLog;
API.prototype.getInstallLogs = getInstallLogs;
API.prototype.updateInstall = updateInstall;
API.prototype.createInstall = createInstall;
API.prototype.getInstallStatusOptions = getInstallStatusOptions;

// Customers
API.prototype.getCustomers = getCustomers;
API.prototype.getCustomer = getCustomer;
API.prototype.updateCustomer = updateCustomer;
API.prototype.createCustomer = createCustomer;
API.prototype.createCustomerLog = createCustomerLog;
API.prototype.getCustomerLogs = getCustomerLogs;
API.prototype.searchCustomer = searchCustomer;

// Users
API.prototype.getUsers = getUsers;
API.prototype.getCurrentUser = getCurrentUser;
API.prototype.updateUser = updateUser;
API.prototype.createUser = createUser;
API.prototype.updateCurrentUser = updateCurrentUser;
API.prototype.changePassword = changePassword;

// Info
API.prototype.getLeadSources = getLeadSources;
API.prototype.getPhaseOptions = getPhaseOptions;
API.prototype.getExistingSystemOptions = getExistingSystemOptions;
API.prototype.getStoryOptions = getStoryOptions;
API.prototype.getRoofTypeOptions = getRoofTypeOptions;
API.prototype.getLeadStatusOptions = getLeadStatusOptions;
API.prototype.getValidRoles = getValidRoles;
API.prototype.getRoofPitchOptions = getRoofPitchOptions;

// Installers
API.prototype.getInstallers = getInstallers;

export const bpmAPI = new API();
