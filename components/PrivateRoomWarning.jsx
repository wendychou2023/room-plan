import React from 'react';
import {getLang, translations} from "../config/languageConfig";

function PrivateRoomWarning() {
    const currentTranslations = translations(getLang());

    return (
        <section tabindex="0"
            className="flex flex-col justify-center max-w-[500px] px-8 py-2.5 w-full border-teal-400 border-solid border-[2px] max-md:px-5 max-md:max-w-full text-center text-xl text-black font-medium">
            {currentTranslations.alert_private}
        </section>
    );
}

export default PrivateRoomWarning;