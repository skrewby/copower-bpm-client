import { parseISO, subDays } from 'date-fns';

// Local import

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
import { getCurrentUser, getUsers } from './users';
import {
    getExistingSystemOptions,
    getLeadSources,
    getLeadStatusOptions,
    getPhaseOptions,
    getRoofTypeOptions,
    getStoryOptions,
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

// Info
API.prototype.getLeadSources = getLeadSources;
API.prototype.getPhaseOptions = getPhaseOptions;
API.prototype.getExistingSystemOptions = getExistingSystemOptions;
API.prototype.getStoryOptions = getStoryOptions;
API.prototype.getRoofTypeOptions = getRoofTypeOptions;
API.prototype.getLeadStatusOptions = getLeadStatusOptions;

export const bpmAPI = new API();
