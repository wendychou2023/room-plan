import * as React from "react";
import LanguageSelector from "./LanguageSelector";
import lang from "./LanguageSelector";
import {getLang, translations} from "../config/languageConfig";
import Link from "next/link"; //error when reloading if used

function Header() {
    const currentTranslations = translations(getLang());

    return (
        <section className="flex flex-col px-8 py-2.5 w-full max-w-[1400px] max-md:px-5 max-md:max-w-full">
            <div className="flex gap-5 justify-between max-md:flex-wrap max-md:max-w-full" style={{marginTop: 30 + 'px'}}>
                <Link href="/" passHref={true}>
                    <h2 className="flex-auto font-medium leading-[150%] cursor-pointer">
                        {currentTranslations.title}
                    </h2>
                </Link>
                <LanguageSelector/>
            </div>
        </section>
    );
}

export default Header;

