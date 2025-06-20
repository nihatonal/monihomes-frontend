import React, { useEffect, useState } from 'react';
import Flag from 'react-world-flags';

function CountryAnalyticsWidget() {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/analytics-countries`)
            .then(res => res.json())
            .then(result => {
                const data = result.rows.map(row => ({
                    country: row.dimensionValues[0].value,
                    users: parseInt(row.metricValues[0].value),
                }));
               
                setCountries(data.filter((item) => item.country !== "(not set)" || ""))
            })
            .catch(console.error);
    }, []);



    return (
        <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-bold mb-4">Ziyaretçi Ülke Dağılımı | Aylık</h2>
            {countries.length === 0 ? (
                <p>Yükleniyor...</p>
            ) : (
                <ul className="space-y-2">
                    {countries.map(({ country, users }, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Flag code={country} style={{ width: '24px' }} />
                                <span>{country}</span>
                            </div>
                            <span className="font-medium">{users}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CountryAnalyticsWidget;
