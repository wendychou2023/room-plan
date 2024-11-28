"use client";

import React, {useState, useCallback, useEffect} from "react";
import Header from "../../components/Header"
import {useRouter,usePathname, useSearchParams} from "next/navigation";
import BackToSearchButton from "../../components/BackToSearchButton";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import {isPrivateRoom} from "../../utils/roomUtils";
import PrivateRoomWarning from "../../components/PrivateRoomWarning";
import {parsedSchedule, timeSlots} from "../../config/scheduleConfig";
import {calculateRowSpan, isTimeInRange, parseTime, toDate, toLocalDate, parsedTimeslot} from "../../utils/scheduleUtils";
import {roomOptions} from "../../config/roomConfig";
import {filterStoredEvents} from "../../dataProcess/dataProcessing";
import {getLang, translations} from "../../config/languageConfig";
import {getDateDisplay, getStringDateDisplay} from "../../utils/dateTimeUtils";

const DailySchedule = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const room = searchParams.get('room');
    const roomId = roomOptions.find((option) => option.value === room)?.roomId;
    let selectedDate = searchParams.get('time');
    const formattedDate = new Date(selectedDate.split('.').reverse().join('-')).toISOString();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currentTranslations = translations(getLang());

    const privateRoom = isPrivateRoom(room);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                setLoading(true);
                const { events } = filterStoredEvents(roomId, {
                    viewType: 'daily',
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



    // Function to find class information for a given day and time
    const findClassForTimeSlot = (day, time) => {
        return schedule.find((entry) => {
            const entryStartTime = parsedTimeslot(entry.start);
            const entryEndTime = parsedTimeslot(entry.end);
            console.log('Entry Start Time:', entryStartTime, 'Entry End Time:', entryEndTime, 'Time:', time);
            return isTimeInRange(entryStartTime, entryEndTime, time);
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

    // Function which parses Week Name (String) to either previous (next == false) or next week (next == true)
    const changeDay = (selectedDate, next) => {
        var res = new Date(toDate(selectedDate));
        //res.setDate(Date.parse(toDate(selectedDate)));
        if(next) selectedDate = res.setDate(res.getDate() + 1);
        else selectedDate = res.setDate(res.getDate() - 1);
        return  toLocalDate(res.toISOString())
    }

    const skippedSlots = {
        [selectedDate]: {},
    };

    return (
        <div className="flex flex-col items-center pb-3.5 bg-white">
            <Header/>
            <BackToSearchButton/>
            <br/>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        router.push(pathname + '?' + createQueryString('time', changeDay( selectedDate, false)))
                    }}
                    className="text-teal-500 hover:text-teal-800"
                    aria-label="Go to the previous week"
                >
                    <FaCaretLeft role="img" aria-hidden="true" className="text-4xl"/>
                </button>
            <h3 className="text-2xl font-bold" tabIndex="0">
                {currentTranslations.schedule_for} {getStringDateDisplay(selectedDate)} {currentTranslations.for} {room}
            </h3>
                <button
                    onClick={() => {
                        router.push(pathname + '?' + createQueryString('time', changeDay( selectedDate, true)))
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
                            <th scope="col" aria-label="column">{currentTranslations.time}</th>
                            <th scope="col" aria-label="column">{getStringDateDisplay(selectedDate)}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {timeSlots.map((time, index) => (
                            <tr key={index} role="row">
                                <td scope="row">{time}</td>
                                {(() => {
                                    if (skippedSlots[selectedDate][time]) {
                                        return null;
                                    }

                                    const classInfo = findClassForTimeSlot(selectedDate, time);
                                    console.log(classInfo);

                                    if (classInfo) {
                                        const slotStart = parsedTimeslot(classInfo.start);
                                        const slotEnd = parsedTimeslot(classInfo.end);
                                        const rowSpan = calculateRowSpan(slotStart, slotEnd);
                                        console.log('Start:', classInfo.start, 'end:', classInfo.end, 'Row Span:', rowSpan);

                                        // Mark the time slots that should be skipped due to rowspan
                                        let timeSlot = parseTime(time);

                                        for (let i = 1; i < rowSpan; i++) {
                                            skippedSlots[selectedDate][`${(timeSlot + i * 100).toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}`] = true;
                                        }

                                        return (
                                            <td rowSpan={rowSpan}
                                                key={selectedDate} tabIndex="0">
                                                <span className="visually-hidden">{classInfo.start} {currentTranslations.to} {classInfo.end}</span>
                                                <span>{classInfo.title}</span>
                                            </td>
                                        );
                                    }
                                    return <td key={selectedDate}></td>;

                                })()
                                }
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

export default DailySchedule;