import { parseISO, subDays } from 'date-fns';

// Local import
import { applyFilters } from '../../utils/apply-filters';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';

// API imports
import { login } from './auth';

class API {}

// Auth
API.prototype.login = login;

export const bpmAPI = new API();
