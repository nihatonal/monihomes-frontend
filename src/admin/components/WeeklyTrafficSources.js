import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

function WeeklyTrafficSources() {
    const [weeklyData, setWeeklyData] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/traffic-sources/weekly`)
            .then(res => res.json())
            .then(result => {
                // Pie için toplama
                const totalPerSource = {};
                result.forEach(entry => {
                    Object.keys(entry.sources).forEach(source => {
                        totalPerSource[source] = (totalPerSource[source] || 0) + entry.sources[source];
                    });
                });

                const pie = Object.entries(totalPerSource).map(([source, sessions]) => ({ source, sessions }));
                setPieData(pie);

                // Line chart için düzenli data
                const line = result.map(day => ({
                    date: day.date,
                    ...day.sources
                }));
                setWeeklyData(line);
            });
    }, []);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Haftalık Trafik Kaynakları</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="sessions"
                            nameKey="source"
                            outerRadius={100}
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Kaynaklara Göre Günlük Ziyaretler</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Tooltip />
                        <Legend />
                        {Object.keys(weeklyData[0] || {}).filter(k => k !== 'date').map((source, index) => (
                            <Line
                                key={source}
                                type="monotone"
                                dataKey={source}
                                stroke={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default WeeklyTrafficSources;
