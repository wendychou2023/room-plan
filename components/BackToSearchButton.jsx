import React from 'react';
import { useRouter } from "next/navigation";
import {getLang, translations} from "../config/languageConfig";

function BackToSearchButton() {
    const router = useRouter();
    const currentTranslations = translations(getLang());

    return (
        <div className="flex justify-center items-center mt-8">
            <button
                aria-label="back to search button" onClick={() => router.push('/')}
                className="px-4 py-2 text-xl font-semibold leading-8 text-black bg-teal-400 rounded-lg shadow-sm whitespace-nowrap"
            >
                {currentTranslations.back_to_search}
            </button>
        </div>
    )
}

export default BackToSearchButton;