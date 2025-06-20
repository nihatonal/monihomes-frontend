import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function YearlyReservations(props) {
    const [data, setData] = useState([]);




    // events: Google Calendar'dan gelen event array'i
    const groupEventsByYear = (events) => {
        const result = {};

        events.forEach(event => {
            const dateStr = event?.start?.dateTime || event?.start?.date;
            const date = new Date(dateStr);

            // Geçerli bir tarih mi kontrolü
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                result[year] = (result[year] || 0) + 1;
            }
        });

        // Recharts için array formatı
        return Object.entries(result).map(([year, total]) => ({
            year,
            totalEvents: total,
        }));
    };
    const reservationsPerYear = groupEventsByYear(props.events);

    return (
        <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-bold mb-4">Yıllık Rezervasyon Analizi</h2>
            {reservationsPerYear.length === 0 ? (
                <p>Yükleniyor...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reservationsPerYear}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="totalEvents" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default YearlyReservations;
