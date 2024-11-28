import calendarConfig from "../../config/config";


export default async function handler(req, res) {
    const { room, periodId, date, week, current } = req.query;

    const url = `${calendarConfig.baseURL}?roomId=${room}&period=${periodId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const icsData = await response.text();
        const events = parseIcsDataWithIcalJs(icsData);

        // Filter events based on the specified date or week
        const filteredEvents = filterEventsByDate(events, { date, week, current });

        res.status(200).json({ events: filteredEvents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
