import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from '../slices/calendar';

const rootReducer = combineReducers({
    calendar: calendarReducer,
});

export default rootReducer;
