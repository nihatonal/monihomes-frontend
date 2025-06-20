import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const monthMap = {
  '1': 'Ocak', '2': 'Şubat', '3': 'Mart', '4': 'Nisan',
  '5': 'Mayıs', '6': 'Haziran', '7': 'Temmuz', '8': 'Ağustos',
  '9': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
};

function YearlyAnalyticsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/analytics-data/yearly`)
      .then(res => res.json())
      .then(result => {
        const formatted = result.rows.map(item => ({
          month: monthMap[item.dimensionValues[0].value],
          users: Number(item.metricValues[0].value),
        }));
        setData(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 shadow rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4">Yıllık Ziyaretçi Grafiği</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="users" fill="#38bdf8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default YearlyAnalyticsChart;
