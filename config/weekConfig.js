import {generateWeekOptions} from "../utils/weeklyScheduleUtils";

//export const weekOptions = [
//    { value: null, label: 'Select a week', firstDay: null },
//    { value: 'Week20', label: 'Week 20: 13.05.2024 - 19.05.2024', firstDay: '2024-05-13'},
//    { value: 'Week21', label: 'Week 21: 20.05.2024 - 26.05.2024', firstDay: '2024-05-20'},
//    { value: 'Week22', label: 'Week 22: 27.05.2024 - 02.06.2024', firstDay: '2024-05-27'},
//];


export const weekOptions = generateWeekOptions(2024);
