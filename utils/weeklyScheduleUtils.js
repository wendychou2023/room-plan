import {weekOptions} from "../config/weekConfig";
import {parseToLocalDate} from "./scheduleUtils";
import {getStringDateDisplay} from "./dateTimeUtils";

export const datesOfTheWeek = (week) => {
    console.log(week);
    const weekOption = weekOptions.find(option => option.firstDay === week);

    const dateRegex = /(\d{2}\.\d{2}\.\d{4}) - (\d{2}\.\d{2}\.\d{4})/;
    const match = weekOption.label.match(dateRegex);

    const dateParts = match[1].split('.');
    const monday = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

    const weekDays = Array.from({ length: 5 }, (_, i) => {
        const day = new Date(monday);
        day.setDate(day.getDate() + i);
        return day.toLocaleDateString('de-DE');
    });

    return {
        Monday: weekDays[0],
        Tuesday: weekDays[1],
        Wednesday: weekDays[2],
        Thursday: weekDays[3],
        Friday: weekDays[4],
    };
}

export const getWeekValueForPageTitle = (day) => {
    const weekOption = weekOptions.find(option => option.firstDay === day);
    return weekOption.value.replace(/(\D+)(\d+)/, '$1 $2');
}

export const getDatesForPageTitle = (day) => {
    const weekOption = weekOptions.find(option => option.firstDay === day);
    const [week, date] = weekOption.label.split(":");
    const [firstDay, lastDay] = date.split("-");
    return `${getStringDateDisplay(firstDay)} - ${getStringDateDisplay(lastDay)}`;
}

export const generateWeekOptions = (year) => {
    const weekList = [];
    let currentDate = new Date(year, 0, 1);

    // Adjust to the first Monday of the year
    while (currentDate.getDay() !== 1) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    let weekNumber = 1;
    while (currentDate.getFullYear() === year) {
        const firstDay = currentDate.toISOString().split('T')[0];
        const lastDay = new Date(currentDate);
        lastDay.setDate(currentDate.getDate() + 6);
        const firstDayLabel = parseToLocalDate(firstDay);
        const lastDayLabel = parseToLocalDate(lastDay.toISOString().split('T')[0]);
        const label = `Week ${weekNumber}: ${firstDayLabel} - ${lastDayLabel}`;
        weekList.push({ value: `Week${weekNumber}`, label: label, firstDay: firstDay });

        // Move to the next week
        currentDate.setDate(currentDate.getDate() + 7);
        weekNumber++;
    }

    return weekList;
};
