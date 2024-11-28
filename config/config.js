// config.js
const calendarConfig = {
    baseURL: 'https://marvin.uni-marburg.de:443/qisserver/pages/cm/exa/timetable/roomScheduleCalendarExport.faces',
    defaultPeriodId: '4138', // Default period ID for the current semester
    otherPeriodIds: {
        winter2024: '4138',
        summer2025: '201'
    }
};

export default calendarConfig;
