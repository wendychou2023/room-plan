"use client";

import React, {useEffect, useState} from "react";
import Header from "../../components/Header";
import {useRouter, useSearchParams} from "next/navigation";
import BackToSearchButton from "../../components/BackToSearchButton";
import PrivateRoomWarning from "../../components/PrivateRoomWarning";
import {isPrivateRoom} from "../../utils/roomUtils";
import {parsedSchedule} from "../../config/scheduleConfig";
import {calculateRowSpan, isTimeInRange, parsedTimeslot} from "../../utils/scheduleUtils";
import {filterStoredEvents} from "../../dataProcess/dataProcessing";
import {roomOptions} from "../../config/roomConfig";
import {getLang, translations} from "../../config/languageConfig";
import {getCurrentTimeDisplay} from "../../utils/dateTimeUtils";


const CurrentSchedule = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const room = searchParams.get('room');
    const currentTime = new Date().toLocaleString('de-DE');
    const formattedDate = new Date(currentTime.split('.').reverse().join('-')).toISOString();
    const roomId = roomOptions.find((option) => option.value === room)?.roomId;

    const currentTranslations = translations(getLang());

    const privateRoom = isPrivateRoom(room);

    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                setLoading(true);
                const { events } = filterStoredEvents(roomId, {
                    viewType: 'current',
                    date: formattedDate,
                });
                console.log('Filtered Data:', events, 'for', formattedDate);
                setSchedule(events);
                setError(null);
            } catch (err) {
                console.error('Error fetching calendar data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredData().catch((err) =>
            console.log('Error fetching calendar data:', err)
        );
    }, [roomId, formattedDate]);

    // Find class for current time
    const findClassForTimeSlot = (day, time) => {
        return schedule.find((entry) => {
            const entryStartTime = parsedTimeslot(entry.start);
            const entryEndTime = parsedTimeslot(entry.end);
            return isTimeInRange(entryStartTime, entryEndTime, time);
        });

    };

    return (
        <div className="flex flex-col items-center pb-3.5 bg-white w-full">
            <Header/>
            <BackToSearchButton/>
            <br/>
            <h3 className="text-2xl font-bold" tabIndex="0">
               {currentTranslations.curr_schedule} {room}
            </h3>
            <br/>
            {privateRoom &&
                <PrivateRoomWarning />
            }
            {!privateRoom &&
                <div>
                    <section tabIndex="0"
                        className="flex flex-col justify-center max-w-[500px] px-8 py-2.5 w-full text-black text-center border-teal-400 border-solid border-[2px] max-md:px-5 max-md:max-w-full">
                        {(() => {
                            const [currDate, currTime] = currentTime.split(', ');

                            const classInfo = findClassForTimeSlot(currDate, currTime);

                            if (classInfo) {
                                const slotStart = parsedTimeslot(classInfo.start);
                                const slotEnd = parsedTimeslot(classInfo.end);
                                return (
                                    <p className="text-xl text-black font-medium">
                                        {slotStart} to {slotEnd} <br/> {classInfo.title}
                                    </p>
                                );
                            } else {
                                return (
                                    <p className="text-xl text-black font-medium">
                                        {currentTranslations.no_events}
                                    </p>
                                );
                            }
                        })()}
                    </section>
                    <br/>
                    <p tabIndex="0" className="text-xl text-black font-medium">
                        {currentTranslations.curr_time} <br/>
                        {getCurrentTimeDisplay()}
                    </p>
                </div>
            }
        </div>
    );
}

export default CurrentSchedule;