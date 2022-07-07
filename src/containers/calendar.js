import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Full Calendar
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/timeline/main.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';

// Material UI
import { Box, Button, Card, Container, Grid } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Local Imports
import { getEvents, updateEvent } from '../slices/calendar';
import { useDispatch, useSelector } from '../store';

// Components
import { CalendarEventDialog } from '../components/calendar/calendar-event-dialog';
import { CalendarToolbar } from '../components/calendar/calendar-toolbar';
import { BPMLayout } from './bpm-layout';
import { AuthGuard } from '../components/auth/auth-guard';

const FullCalendarWrapper = styled('div')(({ theme }) => ({
    '& .fc-license-message': {
        display: 'none',
    },
    '& .fc': {
        '--fc-bg-event-opacity': 1,
        '--fc-border-color': theme.palette.divider,
        '--fc-daygrid-event-dot-width': '10px',
        '--fc-event-text-color': theme.palette.primary.contrastText,
        '--fc-list-event-hover-bg-color': theme.palette.background.default,
        '--fc-neutral-bg-color': theme.palette.background.default,
        '--fc-page-bg-color': theme.palette.background.default,
        '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.25),
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
    },
    '& .fc .fc-col-header-cell-cushion': {
        paddingBottom: '10px',
        paddingTop: '10px',
        fontSize: theme.typography.overline.fontSize,
        fontWeight: theme.typography.overline.fontWeight,
        letterSpacing: theme.typography.overline.letterSpacing,
        lineHeight: theme.typography.overline.lineHeight,
        textTransform: theme.typography.overline.textTransform,
    },
    '& .fc .fc-day-other .fc-daygrid-day-top': {
        color: theme.palette.text.secondary,
    },
    '& .fc-daygrid-event': {
        borderRadius: theme.shape.borderRadius,
        padding: '1px 4px',
        fontSize: theme.typography.subtitle2.fontSize,
        fontWeight: theme.typography.subtitle2.fontWeight,
        lineHeight: theme.typography.subtitle2.lineHeight,
    },
    '& .fc-daygrid-block-event .fc-event-time': {
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.body2.fontWeight,
        lineHeight: theme.typography.body2.lineHeight,
    },
    '& .fc-daygrid-day-frame': {
        padding: '12px',
    },
}));

export const Calendar = () => {
    const dispatch = useDispatch();
    const calendarRef = useRef(null);
    const mobileDevice = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const { events } = useSelector((state) => state.calendar);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(
        mobileDevice ? 'listWeek' : 'dayGridMonth'
    );
    const [dialog, setDialog] = useState({
        isOpen: false,
        eventId: undefined,
        range: undefined,
    });

    useEffect(() => {
        dispatch(getEvents());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = mobileDevice ? 'listWeek' : 'dayGridMonth';

            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [mobileDevice]);

    const handleDateToday = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleViewChange = (newView) => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.changeView(newView);
            setView(newView);
        }
    };

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const handleAddClick = () => {
        setDialog({
            isOpen: true,
        });
    };

    const handleRangeSelect = (arg) => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.unselect();
        }

        setDialog({
            isOpen: true,
            range: {
                start: arg.start.getTime(),
                end: arg.end.getTime(),
            },
        });
    };

    const handleEventSelect = (arg) => {
        setDialog({
            isOpen: true,
            eventId: arg.event.id,
        });
    };

    const handleEventResize = async ({ event }) => {
        try {
            await dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                    extendedProps: event.extendedProps,
                })
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleEventDrop = async ({ event }) => {
        try {
            await dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                    extendedProps: event.extendedProps,
                })
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleCloseDialog = () => {
        setDialog({
            isOpen: false,
        });
    };

    const selectedEvent =
        dialog.eventId && events.find((event) => event.id === dialog.eventId);

    return (
        <>
            <Helmet>
                <title>Calendar | Copower BPM</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    flexGrow: 1,
                    py: 4,
                }}
            >
                <Container maxWidth={false}>
                    <Box>
                        <CalendarToolbar
                            date={date}
                            onDateNext={handleDateNext}
                            onDatePrev={handleDatePrev}
                            onDateToday={handleDateToday}
                            onViewChange={handleViewChange}
                            onAddEvent={handleAddClick}
                            view={view}
                        />
                    </Box>
                    <Card
                        sx={{
                            mt: 3,
                            p: 2,
                        }}
                    >
                        <FullCalendarWrapper>
                            <FullCalendar
                                allDayMaintainDuration
                                dayMaxEventRows={3}
                                droppable
                                editable
                                eventClick={handleEventSelect}
                                eventDisplay="block"
                                eventDrop={handleEventDrop}
                                eventResizableFromStart
                                eventResize={handleEventResize}
                                events={events}
                                headerToolbar={false}
                                height={800}
                                initialDate={date}
                                initialView={view}
                                plugins={[
                                    dayGridPlugin,
                                    interactionPlugin,
                                    listPlugin,
                                    timeGridPlugin,
                                    timelinePlugin,
                                ]}
                                ref={calendarRef}
                                rerenderDelay={10}
                                select={handleRangeSelect}
                                selectable
                                weekends
                            />
                        </FullCalendarWrapper>
                    </Card>
                    <CalendarEventDialog
                        event={selectedEvent}
                        onAddComplete={handleCloseDialog}
                        onClose={handleCloseDialog}
                        onDeleteComplete={handleCloseDialog}
                        onEditComplete={handleCloseDialog}
                        open={dialog.isOpen}
                        range={dialog.range}
                    />
                </Container>
            </Box>
        </>
    );
};
