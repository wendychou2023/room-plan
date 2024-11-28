// Define the language reload anchors
// some aria-labels are missing
// if more languages added, updates are needed in this file
export const langOptions = [
    { value: 'eng', label: 'English' },
    { value: 'ger', label: 'Deutsch' }
];

export const languageConfig = {
    eng: {
        alert_private: "Room information is not available for the public",
        alert_room: "Please select a room.",
        alert_time: "Please select a time.",
        back_to_search: "Back to Search",
        curr: "Today",
        curr_schedule: "Today Schedule for",
        curr_time: "Current Date and Time:",
        daily: "Daily",
        date_format: "MM/dd/yyyy",
        //TODO: fix line break
        description: "This page serves as a quick introduction to Marvin's room.\r\n" +
                    "Only the rooms of the FB12 and the chemistry lecture halls on the Lahnberge are included.\r\n" +
                    "Simply select a room and a time period and press “Search”. \r\n" +
                    "A new window will open.",
        english: "English",
        for: "for",
        friday: "Friday",
        german: "German",
        language: "Language",
        monday: "Monday",
        no_events: "Currently no events.",
        schedule_for: " Schedule of",
        search: "Search",
        select_date: "Select Date",
        select_description: "Select today, weekly, or daily schedule",
        select_room: "Select room",
        select_week: "Select Week",
        selected_date: "Selected Date:",
        select_language: "Select language",
        time: "Time",
        title: "Room Schedule of Multipurpose Building",
        to: "to",
        tuesday: "Tuesday",
        Week: "Week",
        weekly: "Weekly",
        wednesday: "Wednesday",
        thursday: "Thursday",
        show_qr_code: "Show QR Code",
        download_qr_code: "Download QR Code"
    },
    ger: {
        alert_private: "Informaiton für den ausgewählten Raum ist nicht für die Öffentlichkeit verfügber.",
        alert_room: "Bitte wählen Sie einen Raum.",
        alert_time: "Bitte wählen Sie eine Zeit.",
        back_to_search: "Zurück zur Suche",
        curr: "Heute",
        curr_schedule: "Aktueller Plan für",
        curr_time: "Aktuelles Datum und Uhrzeit:",
        daily: "Täglich",
        date_format: "dd.MM.yyyy",
        //TODO: fix line break
        description: "Diese Seite dient als schnelle Einführung in Marvins Raumplan.\r\n" +
                    "Nur die Räume des FB12 und die Chemie-Hörsäle auf den Lahnbergen sind enthalten.\r\n" +
                    "Wählen Sie einfach einen Raum und einen Zeitraum und drücken Sie „Suchen“.\r\n" +
                    "Ein neues Fenster wird geöffnet.",
        english: "Englisch",
        for: "für",
        friday: "Freitag",
        german: "Deutsch",
        language: "Sprache",
        monday: "Montag",
        no_events: "Derzeit keine Ereignisse.",
        schedule_for: "Plan für",
        search: "Suchen",
        select_date: "Datum auswählen",
        select_language: "Wählen Sie eine Sprache aus",
        select_description: "Wählen Sie aktuellen, wöchentlichen oder täglichen Plan",
        select_room: "Raum auswählen",
        select_week: "Woche auswählen",
        selected_date: "Ausgewähltes Datum:",
        time: "Zeit",
        title: "Raumplan des Mehrzweckgebäudes",
        to: "bis",
        tuesday: "Dienstag",
        Week: "Woche",
        weekly: "Wöchentlich",
        wednesday: "Mittwoch",
        thursday: "Donnerstag",
        show_qr_code: "QR-Code anzeigen",
        download_qr_code: "QR-Code herunterladen"
    }, 
};

export function getLang(){
    const savedLang = localStorage.getItem('selectedLang');
    return savedLang ? JSON.parse(savedLang) : langOptions.find((lang) => lang.value === 'ger'); //Set default language German
}

export function translations(lang){
    return languageConfig[lang.value];
}
