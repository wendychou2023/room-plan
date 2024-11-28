import React, { useState } from "react";
import Select from "react-select";
import {langOptions, getLang, translations} from "../config/languageConfig";

export var lang;

const LanguageSelector = () => {
    const [selectedLang, setSelectedLang] = useState(getLang());
    const currentTranslations = translations(selectedLang);

    const handleLangChange = (selectedOption) => {
        setSelectedLang(selectedOption);
        localStorage.setItem('selectedLang', JSON.stringify(selectedOption));
        window.location.reload(); // Refresh the page
    };

    return (
        <div className="flex flex-col items-start pb-3.5 bg-white">
            <label htmlFor="language_select" className="text-1xl text-black font-medium">
                {currentTranslations.language}
            </label>
            <div className="flex gap-2.5 justify-between p-2.5 text-black rounded border border-solid border-zinc-500 mt-0.5 w-full max-w-xs">
                <Select
                    id="language_select"
                    name="language"
                    aria-label={currentTranslations.select_language}
                    value={selectedLang}
                    onChange={handleLangChange}
                    options={langOptions}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default LanguageSelector;