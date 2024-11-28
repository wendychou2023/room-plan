import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { weekOptions } from '../config/weekConfig';
import {getLang, translations} from "../config/languageConfig";
import {getCurrentTimeDisplay, getDateDisplay, getStringDateDisplay} from "../utils/dateTimeUtils";

const TimeTabBox = ({ onTabChange, onTimeChange }) => {
    const [activeTab, setActiveTab] = useState('current');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentTime, setCurrentTime] = useState('Loading...');
    const datePickerRef = useRef();

    const currentTranslations = translations(getLang());

    useEffect(() => {
        if (activeTab === 'current') {
            const time = new Date().toLocaleString('de-DE');
            setCurrentTime(time);
        }
    }, [activeTab]);

    const handleTabChange = (selectedTabOption) => {
        setActiveTab(selectedTabOption);
        onTabChange(selectedTabOption);
        onTimeChange(null);
    };

    const handleWeekChange = (selectedWeekOption) => {
        onTimeChange(selectedWeekOption.firstDay);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = dateFormatToGerman(date);
        onTimeChange(formattedDate);
    };

    const dateFormatToGerman = (date) => {
        return date ? date.toLocaleDateString('de-DE') : '';
    };

    const handleCalendarIconClick = () => {
        datePickerRef.current.setFocus();
    };

    return (
        <div className="flex flex-col max-md:max-w-full TimeTabBox">
            <div className="text-2xl leading-5 font-medium text-black max-md:max-w-full" style={{ marginBottom: 10 + 'px' }} tabIndex="0">
                {currentTranslations.select_description}
            </div>

            {/* Tab Navigation and Content */}
            <div className="flex flex-col px-7 pt-9 pb-20 bg-white rounded border border-teal-400 border-solid max-md:px-5 max-md:max-w-full">
                <div className="flex w-full gap-0 pr-7 text-xl font-medium leading-7 text-center text-black whitespace-nowrap max-md:flex-wrap max-md:pr-5" role="tablist" aria-label="select current tab">
                    <button
                        role="tab"
                        className={`flex-1 justify-center px-4 py-1.5 rounded ${activeTab === 'current' ? 'bg-teal-400' : 'border border-teal-400 bg-neutral-100'}`}
                        onClick={() => handleTabChange('current')}
                    >
                        {currentTranslations.curr || 'Current'}
                    </button>
                    <button
                        role="tab"
                        aria-label="select weekly tab"
                        className={`flex-1 justify-center px-4 py-1.5 rounded ${activeTab === 'weekly' ? 'bg-teal-400' : 'border border-teal-400 bg-neutral-100'}`}
                        onClick={() => handleTabChange('weekly')}
                    >
                        {currentTranslations.weekly || 'Weekly'}
                    </button>
                    <button
                        role="tab"
                        aria-label="select daily tab"
                        className={`flex-1 justify-center px-4 py-1.5 rounded ${activeTab === 'daily' ? 'bg-teal-400' : 'border border-teal-400 bg-neutral-100'}`}
                        onClick={() => handleTabChange('daily')}
                    >
                        {currentTranslations.daily || 'Daily'}
                    </button>
                </div>
                <br/>
                {activeTab === 'weekly' && (
                    <div role="tabpanel" aria-label="weekly tab is selected">
                        <label htmlFor="week" className="text-xl leading-5 font-medium text-black">{currentTranslations.select_week || 'Select Week'}</label>
                        <div className="flex gap-2.5 justify-between p-2.5 text-black rounded border border-solid border-zinc-500">
                            <Select
                                id="week"
                                name="week"
                                aria-label="Select a week"
                                className="w-full p-2.5 rounded"
                                options={weekOptions}
                                onChange={handleWeekChange}
                                getOptionLabel={(e)=>{
                                    const [week, date] = e.label.split(":");
                                    const [weekString, num] = week.split(" ");
                                    const [firstDay, lastDay] = date.split("-");
                                    return `${currentTranslations.Week} ${num}: ${getStringDateDisplay(firstDay)} - ${getStringDateDisplay(lastDay)}`
                                }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'daily' && (
                    <div role="tabpanel" aria-label="daily tab is selected">
                        <label htmlFor="date" className="text-xl leading-5 font-medium text-black" tabIndex="0">
                            {currentTranslations.select_date || 'Select Date'}
                        </label>
                        <div className="flex gap-0 justify-between p-2.5 text-black rounded border border-solid border-zinc-500 max-w-xs">
                            <DatePicker
                                ref={datePickerRef}
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat={currentTranslations.date_format}
                                className="w-full p-2.5 rounded"
                                placeholderText={currentTranslations.date_format}
                            />
                            <FaCalendarAlt
                                className="text-black mt-3 cursor-pointer"
                                onClick={handleCalendarIconClick}
                            />
                        </div>
                        {selectedDate && (
                            <p className="mt-2" tabIndex="0">
                                {currentTranslations.selected_date || 'Selected Date'} {getDateDisplay(selectedDate)}
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'current' && (
                    <div role="tabpanel" aria-label="current tab is selected" tabIndex="0">
                        <p className="text-xl text-black font-medium">
                            {currentTranslations.curr_time || 'Current Time'} <br />
                            {getCurrentTimeDisplay()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeTabBox;