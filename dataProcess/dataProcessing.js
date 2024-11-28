import ICAL from 'ical.js';
import calendarConfig from "../config/config";

// Function to fetch calendar data



export const fetchAndStoreCalendarData = async (roomId, periodId) => {
    try {
        // Check if data is already cached
        const localStorageKey = `calendarData_${roomId}`; // set the key for the local storage
        const cachedData = localStorage.getItem(localStorageKey); // get the data from the local storage

        if (cachedData) {
            return JSON.parse(cachedData);
        }
        //fetch if room data is not cached
        const response = await fetch(`api/proxy?roomId=${roomId}&period=${periodId}`); 
        console.log('Response:', response);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const icsData = await response.text(); 
        const events = parseIcsDataWithIcalJs(icsData);

        const roomDataStored = { events: Array.isArray(events) ? events : [] };
        localStorage.setItem(localStorageKey, JSON.stringify(roomDataStored)); // store the data in the local storage
        console.log('Room data stored:', roomDataStored);
        console.log('Room data stored:', localStorageKey);

        return roomDataStored;

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Fetching data was cancelled');
        }
        throw error;
    }
};

export const filterStoredEvents = (roomId, options = {}) => {
    const {
        viewType = 'daily',
        date = new Date(),
    } = options;
    console.log('View Type:', viewType, 'Date:', date);

    const localStorageKey = `calendarData_${roomId}`;
    const cachedData = localStorage.getItem(localStorageKey);

    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const filteredEvents = filterEventsWithView(parsedData.events, viewType, date);
        return {
            events: Array.isArray(filteredEvents) ? filteredEvents : [],
            periodInfo: { type: viewType, date }
        };
    }
    return { events: [], periodInfo: { type: viewType, date } };
};

export const fetchCalendarData = async (roomId, options = {}) => {
    const {
        viewType = 'daily',
        date = new Date(),
        periodId = calendarConfig.defaultPeriodId,
        signal
    } = options;

    await fetchAndStoreCalendarData(roomId, periodId);
    return filterStoredEvents(roomId, periodId, { viewType, date });
};


export const filterEventsWithView = (events, viewType, date) => {
    console.log(date);
    switch (viewType) {
        case 'daily':
            return events.filter(event => isSameDay(new Date(event.start), date));
        case 'weekly':
            return events.filter(event => isSameWeek(new Date(event.start), date));
        default:
            let currentDate = new Date();
            return events.filter(event => isSameWeek(new Date(event.start), currentDate));
    }
}

// Function to parse ICS data using ical.js
const parseIcsDataWithIcalJs = (icsData) => {
    try {
        const jcalData = ICAL.parse(icsData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const events = [];

        vevents.forEach((vevent) => {
            const event = new ICAL.Event(vevent);
            const uid = event.uid;
            const title = event.summary || '';
            const location = event.location || '';
            const description = event.description || '';
            const timestamp = new Date().toISOString();

            // Parse the start and end times
            const start = event.startDate.toJSDate().toISOString();
            const end = event.endDate.toJSDate().toISOString();

            // Get EXDATEs (excluded dates) if any
            const exdates = vevent.getAllProperties('exdate').map((exdateProp) =>
                exdateProp.getFirstValue().toJSDate()
            );

            // Process recurring events if RRULE exists
            if (event.isRecurring()) {
                const iter = event.iterator(); // Iterate over start date
                let next = iter.next();
                while (next) {
                    const occurrenceStart = next.toJSDate();
                    const occurrenceEnd = new Date(occurrenceStart.getTime() + event.duration.toSeconds() * 1000);

                    if (!exdates.some(exdate => isSameDay(occurrenceStart, exdate))) {
                        events.push({
                            title,
                            start: occurrenceStart.toISOString(),
                            end: occurrenceEnd.toISOString(),
                            location,
                            description,
                            uid,
                            timestamp,
                        });
                    }
                    next = iter.next();
                }
            } else {
                // If non-recurring, just add the single event
                events.push({
                    title,
                    start,
                    end,
                    location,
                    description,
                    uid,
                    timestamp
                });
            }
        });
        return events;
    } catch (error) {
        console.error('Error when parsing ICS data', error);
        return [];
    }
};

// Helper functions to compare dates
const isSameDay = (date1, date2) => {
    const referenceDate = new Date(date2);
    return (
        date1.getUTCFullYear() === referenceDate.getUTCFullYear() &&
        date1.getUTCMonth() === referenceDate.getUTCMonth() &&
        date1.getUTCDate() === referenceDate.getUTCDate()
    );
};


const isSameWeek = (date1, referenceDate) => {
    const startOfWeek = getStartOfWeek(referenceDate);
    const endOfWeek = getEndOfWeek(referenceDate);
    return date1 >= startOfWeek && date1 <= endOfWeek;
};

// Helper functions to get the start and end of the week for weekly view
export const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate());
    startOfWeek.setUTCHours(0, 0, 0, 0);
    return startOfWeek;
};

export const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);
    return endOfWeek;
};


