import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card } from '@mui/material';
import { event } from './events';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';

const localizer = momentLocalizer(moment);

export function Look() {
    return (
        <Card
            sx={{
                p: 2,
            }}
        >
            <Calendar
                popup
                localizer={localizer}
                events={event}
                startAccessor="start"
                endAccessor="end"
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
