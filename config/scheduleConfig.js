import {fetchCalendarData} from "../dataProcess/dataProcessing";
import {filterStoredEvents} from "../dataProcess/dataProcessing";



const mockSchedule = [
    {
        "title": "LV-12-079-018 Übungen zu Algorithmen und Datenstrukturen",
        "start": "2024-05-13T16:00:00+02:00",
        "end": "2024-05-13T18:00:00+02:00",
        "location": "03A11 (HS VI) Hans-Meerwein-Straße 6, Institutsgebäude (H | 04)",
        "description": null,
        "uid": "91140253-bc26-484e-9a59-380aa74d08a1",
        "timestamp": "2024-06-26T12:04:41+00:00"
    },
    {
        "title": "LV-12-105-163 Übungen zu Numerik (Numerische Basisverfahren) / Recitation in Numerical Analysis",
        "start": "2024-05-13T14:00:00+02:00",
        "end": "2024-05-13T16:00:00+02:00",
        "location": "03A11 (HS VI) Hans-Meerwein-Straße 6, Institutsgebäude (H | 04)",
        "description": null,
        "uid": "352cfbb1-6250-44e4-8621-6b06d6cb9f89",
        "timestamp": "2024-06-26T12:04:41+00:00"
    },
    {
        "title": "LV-12-079-339 Digitale Transformation – Gründung IT-basierter Unternehmen (engl. Specialization Module Digital Transformation)",
        "start": "2024-05-14T14:00:00+02:00",
        "end": "2024-05-14T16:00:00+02:00",
        "location": "03A11 (HS VI) Hans-Meerwein-Straße 6, Institutsgebäude (H | 04)",
        "description": null,
        "uid": "f2acb627-7cdf-463e-beab-ad2e8ba952e7",
        "timestamp": "2024-06-26T12:04:41+00:00"
    },
    {
        "title": "LV-12-105-006 Übungen zu Analysis I Schnittstellenübung",
        "start": "2024-11-09T16:00:00+02:00",
        "end": "2024-11-09T20:00:00+02:00",
        "location": "03A11 (HS VI) Hans-Meerwein-Straße 6, Institutsgebäude (H | 04)",
        "description": null,
        "uid": "48975914-06e0-4214-9361-130fe19062a9",
        "timestamp": "2024-06-26T12:04:41+00:00"
    },
];

function removeTimezone(isoString) {
    return isoString.slice(0, 19);
}

export function parseToDateTime(isoString) {
    const date = new Date(removeTimezone(isoString));
    const formattedDate = date.toLocaleDateString('de-DE');
    const formattedTime = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    return { date: formattedDate, time: formattedTime };
}

export const parsedSchedule = mockSchedule.map(entry => {
    const parsedStart = parseToDateTime(entry.start);
    const parsedEnd = parseToDateTime(entry.end);

    return {
        ...entry,
        "date": parsedStart.date,
        "start": parsedStart.time,
        "end": parsedEnd.time,
    };
});

export const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

