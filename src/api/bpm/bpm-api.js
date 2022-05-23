import { parseISO, subDays } from 'date-fns';

// Local import

// API imports
import { login } from './auth';
import {
    getLeads,
    getLead,
    createLeadLog,
    getLeadLogs,
    updateLead,
} from './leads';
import { getUsers } from './users';

class API {}

// Auth
API.prototype.login = login;

// Leads
API.prototype.getLeads = getLeads;
API.prototype.getLead = getLead;
API.prototype.getUsers = getUsers;
API.prototype.createLeadLog = createLeadLog;
API.prototype.getLeadLogs = getLeadLogs;
API.prototype.updateLead = updateLead;

export const bpmAPI = new API();
