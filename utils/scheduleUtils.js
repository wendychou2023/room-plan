// Helper function to parse time strings into numbers (e.g., "09:00" => 900)
export function parseTime(time){
    return parseInt(time.replace(":", ""), 10);
}

// Function to parse date string to YYYY-MM-DD format
export function toDate(time){
    var tmp = time.split(".").reverse().toString();
    if (tmp.length != 10) {
        var b = tmp.slice(0,8);
        var e = tmp.slice(8);
        tmp = b+"0"+e
    }
    return tmp.replaceAll(",", "-")
}

// Function to parse Date Onject to our format (DD,MM,YYYY)
//uses date.toISOString() (format : YYYY-MM-DD) as input
//TODO: add case for english date (input :date.toDateString(), format "Wed Jul 28 1993")
export function toLocalDate(date){
    //gets confused with summer/winter time but minor issue fix, fix with RegEx
    return date.toString().split("-").reverse().toString().replaceAll(",", ".").replace("T00:00:00.000Z","")
}

// Function to check if a time is within a given range
export function isTimeInRange(startTime, endTime, time){
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const current = parseTime(time);

    return current >= start && current < end;
}

// Helper function to calculate the rowSpan for a class based on its start and end time
export function calculateRowSpan(startTime, endTime){
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    return (end - start) / 100; // Each row represents 1 hour
}

// Helper function to parse a ISO time to timeslot
export const parsedTimeslot = (time) => {
    return new Date(time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export const parseToLocalDate = (time) => {
    return new Date(time).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}