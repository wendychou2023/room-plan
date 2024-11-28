import {getLang} from "../config/languageConfig";

export function getCurrentTimeDisplay(){
    const currentLang = getLang().value;

    if (currentLang === "ger"){
        return new Date().toLocaleString("de-DE");
    }else{
        return new Date().toLocaleString("en-US");
    }
}

// Input of type Date object
export function getDateDisplay(selectedDate){
    const currentLang = getLang().value;

    if (currentLang === "ger"){
        return selectedDate.toLocaleDateString('de-DE');
    }else{
        return selectedDate.toLocaleDateString('en-US');
    }
}

// Input of type String
export function getStringDateDisplay(selectedDate){
    const currentLang = getLang().value;

    const [day, month, year] = selectedDate.split('.').map(Number);
    const date = new Date(year, month-1, day);

    if (currentLang === "ger"){
        return date.toLocaleDateString('de-DE');
    }else{
        return date.toLocaleDateString('en-US');
    }
}