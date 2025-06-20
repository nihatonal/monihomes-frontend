import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function AnalyticsWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const monthMap = {
    '01': 'Oca',
    '02': 'Şub',
    '03': 'Mar',
    '04': 'Nis',
    '05': 'May',
    '06': 'Haz',
    '07': 'Tem',
    '08': 'Ağu',
    '09': 'Eyl',
    '10': 'Eki',
    '11': 'Kas',
    '12': 'Ara',
  };


  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/analytics-data`)
      .then(res => res.json())
      .then(result => {
        if (!result.rows || !Array.isArray(result.rows)) {
          throw new Error("Beklenen veri yapısı 'rows' değil.");
        }
        const formattedData = result.rows.map(item => {
          const rawDate = item.dimensionValues[0].value; // 20250421
          const year = rawDate.slice(0, 4);
          const month = rawDate.slice(4, 6);
          const day = rawDate.slice(6, 8);

          const formattedDate = `${monthMap[month]} ${day}`; // Nisan 21

          const users = Number(item.metricValues[0].value);
          return { date: formattedDate, users };
        });
        setData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <h2 className="text-lg font-bold mb-10">Son 7 Günlük Ziyaretçi Sayısı | Websitesi</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default AnalyticsWidget;
