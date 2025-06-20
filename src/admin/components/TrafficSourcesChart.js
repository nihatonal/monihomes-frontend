import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE'];

function TrafficSourcesChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/analytics-traffic-sources`)
            .then(res => res.json())
            .then(result => {
                const data = result.rows.map(row => ({
                    source: row.dimensionValues[0].value,
                    sessions: parseInt(row.metricValues[0].value),
                }));
                setData(data)
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-bold mb-4">Trafik Kaynakları</h2>
            {data.length === 0 ? (
                <p>Yükleniyor...</p>
            ) : (
                <PieChart width={400} height={300}>
                    <Pie
                        data={data}
                        dataKey="sessions"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            )}
        </div>
    );
}

export default TrafficSourcesChart;
