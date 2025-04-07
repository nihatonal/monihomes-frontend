import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import CalendarApp from '../components/CalendarApp';
import StatusRooms from '../components/StatusRooms';
import ReservationList from '../components/ReservationList';
import FutureReservations from '../components/FutureReservations';
const Reservation = () => {
    const [events, setEvents] = useState([]);

    const calendarID = process.env.REACT_APP_CALENDAR_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    useEffect(() => {
        const fetchEvents = async () => {
            const cache = localStorage.getItem('eventsCache');
            const cacheTimestamp = localStorage.getItem('eventsCacheTimestamp');
            const cacheDuration = 1000 * 60 * 5; // 5 dakika

            if (cache && Date.now() - cacheTimestamp < cacheDuration) {
                setEvents(JSON.parse(cache));
                return;
            }

            try {
                await gapi.load("client", async () => {
                    await gapi.client.init({ apiKey });
                    const now = new Date(2000, 0, 1).toISOString(); // geçmişten itibaren

                    const response = await gapi.client.request({
                        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?key=${apiKey}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=500`,
                    });

                    const events = response.result.items;
                    localStorage.setItem('eventsCache', JSON.stringify(events.filter((item) => item.summary.toLowerCase().includes("room"))));
                    localStorage.setItem('eventsCacheTimestamp', Date.now().toString());
                    setEvents(events.filter((item) => item.summary.toLowerCase().includes("room")));

                    const reserved = events.map(event => {
                        const startDate = new Date(event.start.date);
                        const endDate = new Date(event.end.date);
                        let dates = [];

                        // startDate ile endDate arasındaki her günü ekle
                        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                            dates.push(d.toLocaleDateString());
                        }

                        return dates;
                    }).flat();

                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
    }, [calendarID, apiKey]);

    // Toplam rezervasyon sayısını hesaplamak
    const getReservationsPerYear = (events) => {
        const counts = {};

        events.forEach(event => {
            const startStr = event.start.dateTime || event.start.date;
            const year = new Date(startStr).getFullYear();

            if (counts[year]) {
                counts[year]++;
            } else {
                counts[year] = 1;
            }
        });

        return counts; // Örn: {2023: 5, 2024: 8}
    };
    const reservationsPerYear = getReservationsPerYear(events);



    return (
        <div className="bg-gray-100">
            {/* Main Content */}
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6 wlex-wrap p-6 overflow-y-auto bg-gray-50">
                {/* Toplam Rezervasyonlar */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h4 className="text-gray-800 font-semibold text-lg mb-4">Yıllara Göre Rezervasyonlar</h4>
                    <div className="flex flex-wrap gap-4 justify-start">
                        {Object.entries(reservationsPerYear)
                            .sort((a, b) => b[0] - a[0])
                            .map(([year, count]) => (
                                <div
                                    key={year}
                                    className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform"
                                >
                                    <div className="text-base sm:text-xl font-bold">{year}</div>
                                    <div className="text-xs sm:text-sm">Rezervasyon</div>
                                    <div className="text-lg sm:text-2xl font-semibold">{count}</div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Oda Durumları */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <StatusRooms events={events} />
                </div>

                {/* Rezervasyonları Listeleme */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <ReservationList events={events} />
                </div>

                {/* Gelecek Rezervasyonlar */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <FutureReservations events={events} />
                </div>

                {/* <CalendarApp futureReservations={futureReservations} /> */}
            </main>
        </div>
    );
};

export default Reservation;
