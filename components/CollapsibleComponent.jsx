import React, { useState, useEffect } from 'react';
import {getLang, translations} from "../config/languageConfig";

const CollapsibleComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');

    const currentTranslations = translations(getLang());

    useEffect(() => {
        setTitle(currentTranslations.title);
    }, []);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section className="flex flex-col justify-center px-8 py-2.5 w-full text-center text-black border-teal-400 border-solid border-[3px] max-w-[1348px] max-md:px-5 max-md:max-w-full">
            <button type="button" aria-label="page title Room Schedule of Multipurpose Building"
                    className="text-6xl font-bold tracking-tighter max-md:max-w-full max-md:text-4xl"
                    onClick={toggleOpen}>
                {title}
            </button>
            {isOpen && (
                <div className="content" tabIndex="0">
                    <p className="mt-6 text-xl font-medium leading-8 max-md:max-w-full">
                        {currentTranslations.description}
                    </p>
                </div>
            )}
        </section>
    );
};

export default CollapsibleComponent;