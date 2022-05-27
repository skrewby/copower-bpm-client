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
import { createUser, getCurrentUser, getUsers, updateUser } from './users';
import {
    getExistingSystemOptions,
    getLeadSources,
    getLeadStatusOptions,
    getPhaseOptions,
    getRoofTypeOptions,
    getStoryOptions,
    getValidRoles,
} from './info';

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

// Users
API.prototype.getUsers = getUsers;
API.prototype.getCurrentUser = getCurrentUser;
API.prototype.updateUser = updateUser;
API.prototype.createUser = createUser;

// Info
API.prototype.getLeadSources = getLeadSources;
API.prototype.getPhaseOptions = getPhaseOptions;
API.prototype.getExistingSystemOptions = getExistingSystemOptions;
API.prototype.getStoryOptions = getStoryOptions;
API.prototype.getRoofTypeOptions = getRoofTypeOptions;
API.prototype.getLeadStatusOptions = getLeadStatusOptions;
API.prototype.getValidRoles = getValidRoles;

export const bpmAPI = new API();
