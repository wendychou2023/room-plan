"use client"

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import CollapsibleComponent from "../components/CollapsibleComponent";
import TimeTabBox from "../components/TimeTabBox";
import RoomSelectionBox from "../components/RoomSelectionBox";
import {fetchAndStoreCalendarData} from "../dataProcess/dataProcessing";
import calendarConfig from "../config/config";
import {getLang, translations} from "../config/languageConfig";


function RoomTimeSelection() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedTab, setSelectedTab] = useState('current');
    const [selectedTime, setSelectedTime] = useState(null);
    const [calendarData, setCalendarData] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const currentTranslations = translations(getLang());

    const handleRoomSelection = (selectedRoomValue) => {
        setSelectedRoom(selectedRoomValue);
    };

    const handleTabSelection = (selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const handleTimeSelection = (time) => {
        setSelectedTime(time);
        console.log('Selected time:', time);
    };

    const handleSearch = async () => {
        if (!selectedRoom || selectedRoom.value == null) {
            alert(currentTranslations.alert_room);
        } else {
            let route;
            if (selectedTab === 'current') {
                route = `/${selectedTab}?room=${selectedRoom.value}&time=current`;
            } else {
                if (!selectedTime) {
                    alert(currentTranslations.alert_time);
                    return;
                }
                route = `/${selectedTab}?room=${selectedRoom.value}&time=${selectedTime}`;
            }



            try {
                setLoading(true);
                localStorage.removeItem(`calendarData_${selectedRoom.roomId}`);
                await fetchAndStoreCalendarData(selectedRoom.roomId, calendarConfig.defaultPeriodId);

                // Push the route
                router.push(route);


            } catch (error) {
                console.error('Error fetching calendar data:', error);
                alert('Failed to fetch calendar data. Please try again.');
            }finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="flex flex-col w-full max-w-[1043px] max-md:max-w-full">
          <div className="flex gap-5 justify-between max-md:flex-wrap max-md:max-w-full" style={{marginTop: 30 + 'px'}}>
              <div className="w-[300px]">
                  <RoomSelectionBox onRoomChange={handleRoomSelection}/>
              </div>
              <TimeTabBox onTabChange={handleTabSelection} onTimeChange={handleTimeSelection}/>
          </div>
            <button aria-label="search button" onClick={handleSearch}
                    className="justify-center self-center px-4 py-2 mt-20 text-xl font-semibold leading-8 text-black whitespace-nowrap bg-teal-400 rounded-lg shadow-sm max-md:pr-7 max-md:pl-7 max-md:mt-10">
            {currentTranslations.search||'Search'}
          </button>
        </section>
    );
}

function HomePage() {
    return (
        <div className="flex flex-col items-center pb-3.5 bg-white">
          <Header />
            <br />
          <CollapsibleComponent />
            <br />
          <RoomTimeSelection />
        </div>
    );
}

export default HomePage;