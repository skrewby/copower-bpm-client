import { createSlice } from '@reduxjs/toolkit';
import { addHours, parseISO } from 'date-fns';
import { bpmAPI } from '../api/bpm/bpm-api';
import { bpmServer } from '../api/bpm/bpm-server';
import { generateResourceId } from '../utils/generate-resource-id';

const initialState = {
    events: [],
    isModalOpen: false,
    selectedEventId: null,
    selectedRange: null,
};

const slice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        getEvents(state, action) {
            state.events = action.payload;
        },
        createEvent(state, action) {
            state.events.push(action.payload);
        },
        selectEvent(state, action) {
            state.isModalOpen = true;
            state.selectedEventId = action.payload;
        },
        updateEvent(state, action) {
            const event = action.payload;

            state.events = state.events.map((_event) => {
                if (_event.id === event.id) {
                    return event;
                }

                return _event;
            });
        },
        deleteEvent(state, action) {
            state.events = state.events.filter(
                (event) => event.id !== action.payload
            );
        },
        selectRange(state, action) {
            const { start, end } = action.payload;

            state.isModalOpen = true;
            state.selectedRange = {
                start,
                end,
            };
        },
        openModal(state) {
            state.isModalOpen = true;
        },
        closeModal(state) {
            state.isModalOpen = false;
            state.selectedEventId = null;
            state.selectedRange = null;
        },
    },
});

export const { reducer } = slice;

export const getEvents = () => async (dispatch) => {
    const installs = await bpmServer
        .api()
        .url('api/installs')
        .get()
        .json((response) => {
            return response;
        });
    const scheduledInstalls = installs.filter(
        (install) => install.schedule.scheduled
    );
    const installSchedules = scheduledInstalls.map((install) => {
        return {
            id: generateResourceId(),
            allDay: false,
            title: `${install.customer.first_name} ${install.customer.last_name}`,
            description: install.property.address,
            start: install.schedule.date,
            color: '#1e9e40',
            end: addHours(parseISO(install.schedule.date), 6).toISOString(),
            extendedProps: {
                install: true,
                install_id: install.install_id,
            },
        };
    });
    const data = await bpmAPI.getEvents();
    const events = data.map((event) => {
        return {
            id: event.id,
            allDay: event.allday,
            title: event.title,
            description: event.description,
            start: event.startdate,
            end: event.enddate,
        };
    });

    dispatch(slice.actions.getEvents(events.concat(installSchedules)));
};

export const createEvent = (createData) => async (dispatch) => {
    const data = await bpmAPI.createEvent(createData);
    dispatch(slice.actions.createEvent(data));
};

export const selectEvent = (eventId) => async (dispatch) => {
    dispatch(slice.actions.selectEvent(eventId));
};

export const updateEvent = (eventId, update) => async (dispatch) => {
    if (update.extendedProps.install) {
        await bpmAPI.updateInstall(update.extendedProps.install_id, {
            schedule: update.start,
        });
    } else {
        const data = await bpmAPI.updateEvent(eventId, update);
        dispatch(slice.actions.updateEvent(eventId, data));
    }
};

export const deleteEvent = (eventId) => async (dispatch) => {
    await bpmAPI.deleteEvent(eventId);

    dispatch(slice.actions.deleteEvent(eventId));
};

export const selectRange = (start, end) => (dispatch) => {
    dispatch(slice.actions.selectRange({ start, end }));
};

export const openModal = () => (dispatch) => {
    dispatch(slice.actions.openModal());
};

export const closeModal = () => (dispatch) => {
    dispatch(slice.actions.closeModal());
};

export default slice;
