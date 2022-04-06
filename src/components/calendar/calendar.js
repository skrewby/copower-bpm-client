import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Card } from '@mui/material';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enAU from 'date-fns/locale/en-AU';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';

export function BPMCalendar() {
    const [events, setEvents] = useState([
        {
            title: 'Install - 20 Rupert Street',
            bgColor: '#4e598c',
            allDay: true,
            start: new Date(2022, 4, 6),
            end: new Date(2022, 4, 7),
            type: 'install',
        },
        {
            title: 'Install - 34 Albert Street',
            bgColor: '#4e598c',
            allDay: true,
            start: new Date(2022, 4, 7),
            end: new Date(2022, 4, 8),
            type: 'install',
        },
        {
            title: 'Service - 20 Rupert Street',
            bgColor: '#33658a',
            start: new Date(2022, 5, 13, 0, 0, 0),
            end: new Date(2022, 5, 20, 0, 0, 0),
            type: 'service',
        },
        {
            title: 'Service - 34 Albert Street',
            bgColor: '#33658a',
            start: new Date(2022, 4, 6, 0, 0, 0),
            end: new Date(2022, 4, 13, 0, 0, 0),
            type: 'service',
        },

        {
            title: 'Home Visit - 20 Rupert Street',
            bgColor: '#585123',
            start: new Date(2022, 4, 9, 0, 0, 0),
            end: new Date(2022, 4, 9, 0, 0, 0),
            type: 'visit',
        },
        {
            title: 'Conference',
            bgColor: '#eec170',
            start: new Date(2022, 4, 11),
            end: new Date(2022, 4, 13),
            desc: 'Big conference for important people',
            type: 'conference',
        },
        {
            title: 'Meeting',
            bgColor: '#606c38',
            start: new Date(2022, 4, 12, 10, 30, 0, 0),
            end: new Date(2022, 4, 12, 12, 30, 0, 0),
            desc: 'Pre-meeting meeting, to prepare for the meeting',
            type: 'meeting',
        },
        {
            title: 'Barbeque',
            bgColor: '#606c38',
            start: new Date(2022, 4, 12, 12, 0, 0, 0),
            end: new Date(2022, 4, 12, 13, 0, 0, 0),
            type: 'barbeque',
        },
        {
            title: 'Pickup',
            bgColor: '#e76f51',
            start: new Date(2022, 3, 12, 14, 0, 0, 0),
            end: new Date(2022, 3, 12, 15, 0, 0, 0),
            type: 'pickup',
        },
        {
            title: 'Delivery',
            bgColor: '#f4a261',
            start: new Date(2022, 4, 17, 17, 0, 0, 0),
            end: new Date(2022, 4, 17, 17, 30, 0, 0),
            type: 'delivery',
        },
        {
            title: 'Dinner',
            bgColor: '#2a9d8f',
            start: new Date(2022, 3, 15, 20, 0, 0, 0),
            end: new Date(2022, 3, 15, 21, 0, 0, 0),
            type: 'dinner',
        },
        {
            title: 'Birthday Party',
            bgColor: '#264653',
            start: new Date(2022, 4, 13, 7, 0, 0),
            end: new Date(2022, 4, 13, 10, 30, 0),
            type: 'birthday',
        },
        {
            title: 'Birthday Party 2',
            bgColor: '#264653',
            start: new Date(2022, 4, 14, 8, 0, 0),
            end: new Date(2022, 4, 14, 10, 30, 0),
            type: 'birthday',
        },
        {
            title: 'Birthday Party 3',
            bgColor: '#264653',
            start: new Date(2022, 3, 15, 7, 0, 0),
            end: new Date(2022, 3, 15, 10, 30, 0),
            type: 'birthday',
        },
    ]);

    const locales = {
        'en-AU': enAU,
    };
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });

    return (
        <Card
            sx={{
                p: 2,
            }}
        >
            <Calendar
                localizer={localizer}
                events={events}
                style={{ height: 600 }}
                defaultView="month"
                onSelectEvent={(event) => alert(event.title)}
                onSelectSlot={(slotInfo) =>
                    alert(
                        `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                            `\nend: ${slotInfo.end.toLocaleString()}` +
                            `\naction: ${slotInfo.action}`
                    )
                }
                eventPropGetter={(event) => ({
                    event,
                    style: { backgroundColor: event.bgColor },
                })}
            />
        </Card>
    );
}
