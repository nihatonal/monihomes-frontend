import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { PieChart, Pie, Cell, BarChart, Bar, LabelList, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import moment from 'moment';

import AnalyticsWidget from '../components/AnalyticsWidget';
import YearlyReservations from "../components/YearlyReservations";
import CountryAnalyticsWidget from '../components/CountryAnalyticsWidget';
import TrafficSourcesChart from "../components/TrafficSourcesChart";
import WeeklyTrafficSources from "../components/WeeklyTrafficSources";
import "swiper/css";
// Aylar için renkler
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000", "#800080", "#800000", "#FF6347", "#C71585", "#00008B", "#A52A2A", "#5F9EA0"];

const barColors = ["#7BB0F2", "#8C9FF2", "#A68CF2", "#BC8CF2", "#71D6E2"];
export default function Analytic({ events }) {
    const [reservations, setReservations] = useState([])

    const [occupancyData, setOccupancyData] = useState([]);
    //Rezervasyon listesi
    useEffect(() => {
        const parsedReservations = events.map((event) => {
            const paymentStatuses = ["ödeme alındı", "ödendi", "ödeme yapıldı", "Ücret alındı", "alındı"];
            const customerName = event.summary || "İsimsiz";
            const email = event.creator?.email || "Bilinmiyor";
            const desc = event.description
            const room = (event.summary || "").toLowerCase().includes("room1")
                ? "Room 1"
                : (event.summary || "").toLowerCase().includes("room2")
                    ? "Room 2"
                    : (event.summary || "").toLowerCase().includes("room3")
                        ? "Room 3"
                        : "Bilinmeyen Oda";

            return {
                id: event.id,
                customerName,
                email,
                room,
                start: event.start.date,
                end: event.end.date,
                desc,
                paymentStatus: paymentStatuses.some(status => event.description?.toLowerCase().includes(status.toLowerCase())) ?? false,
            };
        });

        setReservations(parsedReservations)

        // Doluluk oranlarını hesapla
        const occupancy = getOccupancyRate(parsedReservations);
        setOccupancyData(occupancy);
    }, [events]);


    // Grupla ve say
    const groupedByMonth = reservations.reduce((acc, event) => {
        const monthKey = moment(event.start).format("MMM-YY");

        // Eğer aynı oda ve tarih varsa, duplicate saymayı engelle
        const isDuplicate = acc[monthKey]?.events.some(
            existingEvent => existingEvent.start === event.start && existingEvent.room === event.room
        );

        if (!acc[monthKey]) {
            acc[monthKey] = {
                name: monthKey,
                rezervasyon: 0,
                events: [] // event listesi ekle
            };
        }

        if (!isDuplicate) {
            acc[monthKey].rezervasyon += 1;
            acc[monthKey].events.push(event); // Eventi kaydet
        }

        return acc;
    }, {});


    const sortedMonthlyCounts = Object.values(groupedByMonth).sort((a, b) => a.timestamp - b.timestamp);

    // Sonuçları diziye çevir
    const result = Object.values(sortedMonthlyCounts).slice(-8);


    //Aylik doluluk orani

    // Google Events verisini alıp aylık doluluk oranını hesaplayan fonksiyon
    const getOccupancyRate = (events) => {
        const totalRooms = 3; // 3 odalı bir otel olduğunu varsayıyoruz

        const groupedByMonth = events.reduce((acc, event) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            // Başlangıç ve bitiş tarihleri arasındaki günleri al
            const reservedDays = getDaysBetweenDates(startDate, endDate);

            // Her bir rezervasyonun hangi ayda olduğunu belirleyip ay bazında grupla
            reservedDays.forEach((day) => {
                const month = day.getMonth(); // Ay bilgisini al
                const year = day.getFullYear();
                const monthKey = `${year}-${month + 1}`; // YYYY-MM formatında bir anahtar oluştur

                if (year === 2025) { // 2025 yılına ait olacak şekilde filtreleme
                    if (!acc[monthKey]) acc[monthKey] = new Set(); // Odanın rezerve edildiği günleri tutmak için Set kullanıyoruz
                    acc[monthKey].add(day.toISOString().split('T')[0]);  // Rezervasyon yapılan günü ekle (YYYY-MM-DD formatında)
                }
            });

            return acc;
        }, {});

        const monthlyOccupancy = Object.keys(groupedByMonth).map((monthKey) => {
            const reservedDays = groupedByMonth[monthKey].size;  // O ayda rezerve edilen gün sayısı
            const daysInMonth = getDaysInMonth(monthKey); // Bu ayın gün sayısını al
            const totalOdaGün = totalRooms * daysInMonth; // Toplam oda-gün kapasitesi (3 oda x gün sayısı)
            const occupancyRate = (reservedDays / totalOdaGün) * 100; // Doluluk oranını hesapla
            return {
                month: monthKey,
                occupancyRate: occupancyRate.toFixed(2), // 2 ondalıklı basamağa yuvarlama
            };
        });

        return monthlyOccupancy;
    };

    // Start ve end tarihleri arasındaki tüm günleri alacak fonksiyon
    const getDaysBetweenDates = (startDate, endDate) => {
        const days = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    // Her ayın gün sayısını hesaplayan fonksiyon
    const getDaysInMonth = (monthKey) => {
        const [year, month] = monthKey.split('-').map(Number); // YYYY-MM formatında gelen ayı parçala
        const date = new Date(year, month, 0); // O ayın son gününü al
        return date.getDate(); // O ayın toplam gün sayısını döndür
    };

    return (
        <div className="px-4 pb-4 md:pb-0 flex flex-col md:grid grid-cols-2 gap-6">
            <div className="bg-[#F1F6FC] px-4 py-4 md:py-0 rounded-xl flex flex-col justify-center gap-4">
                <div className="px-0 md:px-4">
                    <h4 className="font-semibold text-md mb-2">Doluluk Analiz</h4>
                    <div className="flex items-center gap-4">
                        <div className="w-1/3 ">
                            <PieChart width={100} height={100}>
                                <Pie
                                    data={occupancyData.map(item => ({
                                        month: item.month,
                                        occupancyRate: parseFloat(item.occupancyRate) // Sayıya dönüştürme
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={45}
                                    fill="#8884d8"
                                    dataKey="occupancyRate"
                                    labelLine={false}
                                >
                                    {occupancyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={12}
                                    fill="#333"
                                >
                                    Doluluk
                                </text>
                            </PieChart>
                        </div>
                        <div className='w-2/3 flex flex-wrap gap-y-1 gap-x-4 items-center'>
                            {occupancyData.map((item) =>
                                <p className=" w-20 text-sm text-gray-600" key={item.month}>{moment(item.month).format("MMM-YY")}: <strong>{Math.round(item.occupancyRate)}%</strong></p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-0 md:px-4">
                    <h4 className="font-semibold text-md mb-2">Aylık Durum</h4>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={result} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                interval={0}
                                tick={{ fontSize: 9, fill: "#666" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    border: "none",
                                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                                }}
                                labelStyle={{ color: "#666" }}
                                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                            />
                            <Bar dataKey="rezervasyon" radius={[10, 10, 0, 0]}>
                                {result.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                ))}
                                <LabelList
                                    dataKey="rezervasyon"
                                    position="top"
                                    content={({ x, y, width, value }) => (
                                        <text
                                            x={x + width / 2}
                                            y={y - 3}
                                            textAnchor="middle"
                                            fill="#000"
                                            fontSize={13}
                                        >
                                            {value}
                                        </text>
                                    )}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
            <div className=''>
                <YearlyReservations events={events} />
            </div>
            <div className=''><AnalyticsWidget />
            </div>
            <div className=''><CountryAnalyticsWidget />
            </div>
            {/* <TrafficSourcesChart /> */}
            <div className="col-span-2">
                <WeeklyTrafficSources />
            </div>
        </div >
    );
}
