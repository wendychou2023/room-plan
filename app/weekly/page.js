"use client";

import React, {useState, useCallback, useEffect} from "react";
import Header from "../../components/Header"
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import BackToSearchButton from "../../components/BackToSearchButton";
import {isPrivateRoom} from "../../utils/roomUtils";
import { parsedSchedule, timeSlots, parseToDateTime } from "../../config/scheduleConfig";
import {calculateRowSpan, isTimeInRange, parseTime, parsedTimeslot} from "../../utils/scheduleUtils";
import PrivateRoomWarning from "../../components/PrivateRoomWarning";
import {datesOfTheWeek, getDatesForPageTitle, getWeekValueForPageTitle} from "../../utils/weeklyScheduleUtils";
import {fetchCalendarData, fetchAndStoreCalendarData, filterStoredEvents} from "../../dataProcess/dataProcessing";
import {weekOptions} from "../../config/weekConfig";
import {roomOptions} from "../../config/roomConfig";
import {getLang, translations} from "../../config/languageConfig";

const WeeklySchedule = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const room = searchParams.get('room');
    const roomId = roomOptions.find((option) => option.value === room)?.roomId;
    let firstDayofWeek = searchParams.get('time');
    const weekFirstDay = weekOptions.find(option => option.firstDay === firstDayofWeek);
    const dates = datesOfTheWeek(firstDayofWeek);
    const selectedTab = searchParams.get('tab');

    const currentTranslations = translations(getLang());

    const privateRoom = isPrivateRoom(room);

    // Mock state (since the API is not ready)
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {

                setLoading(true);
                const {events} = filterStoredEvents(roomId, {viewType: 'weekly', date: firstDayofWeek});
                setSchedule(events);
                console.log('Filtered Data:', events);
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
    }, [roomId, firstDayofWeek]);

    // Function to find class information for a given day and time

    const findClassForTimeSlot = (day, time) => {
        return schedule.find((entry) => {
            const entryDate = new Date(entry.start).toLocaleDateString('de-DE');
            const entryStartTime = parsedTimeslot(entry.start);
            const entryEndTime = parsedTimeslot(entry.end);
            console.log('Entry Date:', entryDate,entryStartTime, entryEndTime);
            return entryDate === dates[day] && isTimeInRange(entryStartTime, entryEndTime, time);
        });

    };

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
        
            return params.toString()
        },
        [searchParams]
    )

    // Function which updates the week to either previous (next == false) or next week (next == true)
    const updateWeek = (currentWeek, next) => {
        const currentDate = new Date(currentWeek);
        const newDate = new Date(currentDate.setDate(currentDate.getDate() + (next ? 7 : -7)));
        return newDate.toISOString().split('T')[0];
    }

    // Function which parses Week Name (String) to either previous (next == false) or next week (next == true)
   const changeWeek = (week_string, next) => {
        let string_div = week_string.split("k");
        if(next) firstDayofWeek =  string_div[0]+"k" + parseInt(parseInt(string_div[1])+1) ;
        else firstDayofWeek = string_div[0]+"k" +  parseInt(parseInt(string_div[1])-1);
        return  firstDayofWeek
    }


    // Track which slots should be skipped due to rowSpan
    const skippedSlots = {
        Monday: {},
        Tuesday: {},
        Wednesday: {},
        Thursday: {},
        Friday: {},
    };

    return (
        <div className="flex flex-col items-center pb-3.5 bg-white">
            <Header/>
            <BackToSearchButton/>
            <br/>
            {/* Page title & previous and next week buttons */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        router.push(pathname + '?' + createQueryString('time', updateWeek( firstDayofWeek, false)))
                    }}
                    className="text-teal-500 hover:text-teal-800"
                    aria-label="Go to the previous week"
                >
                    <FaCaretLeft role="img" aria-hidden="true" className="text-4xl"/>
                </button>
                <h3 className="text-2xl font-bold text-center" tabIndex="0">
                    {currentTranslations.schedule_for} {getDatesForPageTitle(firstDayofWeek)} {currentTranslations.for} {room}
                </h3>
                <button
                    onClick={() => {
                        router.push(pathname + '?' + createQueryString('time', updateWeek( firstDayofWeek, true)))
                    }}                    
                    className="text-teal-500 hover:text-teal-800"
                    aria-label="Go to the next week"
                >
                    <FaCaretRight role="img" aria-hidden="true" className="text-4xl"/>
                </button>
            </div>

            <br/>
            {privateRoom &&
                <PrivateRoomWarning />
            }
            {!privateRoom &&
                <div className="table-container">
                    <table role="table">
                        <thead>
                        <tr>
                            <th scope="col">{currentTranslations.time}</th>
                            <th scope="col" aria-label="column">{currentTranslations.monday}</th>
                            <th scope="col" aria-label="column">{currentTranslations.tuesday}</th>
                            <th scope="col" aria-label="column">{currentTranslations.wednesday}</th>
                            <th scope="col" aria-label="column">{currentTranslations.thursday}</th>
                            <th scope="col" aria-label="column">{currentTranslations.friday}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {timeSlots.map((time, index) => (
                            <tr key={index} role="row">
                                {/* Time Slot Column */}
                                <td scope="row" aria-label="row">{time}</td>
                                {/* Monday to Friday Columns */}
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                                    // Check if this time slot has already been filled
                                    if (skippedSlots[day][time]) {
                                        return null;
                                    }

                                    const classInfo = findClassForTimeSlot(day, time);
                                    if (classInfo) {
                                        const slotStart = parsedTimeslot(classInfo.start);
                                        const slotEnd = parsedTimeslot(classInfo.end);
                                        const rowSpan = calculateRowSpan(slotStart, slotEnd);

                                        // Mark the time slots that should be skipped due to rowspan
                                        let timeSlot = parseTime(time);
                                        console.log('classInfo:', classInfo, 'rowSpan:', rowSpan);
                                        for (let i = 1; i < rowSpan; i++) {
                                            skippedSlots[day][`${(timeSlot + i * 100).toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}`] = true;
                                        }

                                        return (
                                            <td rowSpan={rowSpan}
                                                key={day} tabIndex="0">
                                                <span className="visually-hidden">{day} {classInfo.start} to {classInfo.end}</span>
                                                <span>{classInfo.title}</span>
                                            </td>
                                        );
                                    }
                                    return <td key={day}></td>;
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

export default WeeklySchedule;




