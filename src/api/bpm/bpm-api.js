import { parseISO, subDays } from 'date-fns';

// Local import

// API imports
import { login } from './auth';
import { getLeads } from './leads';

class API {}

// Auth
API.prototype.login = login;

// Leads
API.prototype.getLeads = getLeads;

export const bpmAPI = new API();
