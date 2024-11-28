import React from 'react';
import Select from 'react-select';
import { roomOptions } from '../config/roomConfig';
import {getLang, translations} from "../config/languageConfig"; // Ensure this import is correct

const RoomSelectionBox = ({ onRoomChange }) => {
    const handleChange = (selectedOption) => {
        onRoomChange(selectedOption);
    };

    const currentTranslations = translations(getLang());

    return (
        <div className="room-selection-box">
            <label htmlFor="room-select" className="sr-only">
                {currentTranslations.select_room}
            </label>
            <div className="text-2xl leading-5 font-medium text-black max-md:max-w-full"
                 style={{marginBottom: 10 + 'px'}} tabIndex="0">
                {currentTranslations.select_room}
            </div>
            <div
                className="flex gap-2.5 justify-between p-2.5 text-black rounded border border-solid border-zinc-500 mt-2.5 w-full max-w-xs">
                <Select
                    id="room-select"
                    name="room"
                    aria-label={currentTranslations.select_room}
                    onChange={handleChange}
                    options={roomOptions}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default RoomSelectionBox;