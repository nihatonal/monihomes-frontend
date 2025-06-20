import React, { useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { PieChart, Pie, Cell, BarChart, Bar, LabelList, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import moment from 'moment';
import StatusRooms from "./components/StatusRooms";
import { Swiper, SwiperSlide } from "swiper/react";

import AnalyticsWidget from './components/AnalyticsWidget'
import "swiper/css";
// Aylar için renkler
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000", "#800080", "#800000", "#FF6347", "#C71585", "#00008B", "#A52A2A", "#5F9EA0"];

const barColors = ["#7BB0F2", "#8C9FF2", "#A68CF2", "#BC8CF2", "#71D6E2"];
export default function Dashboard({ events }) {
    const [futureReservations, setFutureReservations] = useState([]);
    const [reservations, setReservations] = useState([])
    const [currentOccupants, setCurrentOccupants] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
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

        const filterEventsForToday = (events) => {
            const today = new Date(); // Current date and time

            return events.filter((event) => {
                const startDate = new Date(event.start); // Convert the event start time
                const endDate = new Date(event.end); // Convert the event end time

                // Check if today's date falls between the event's start and end date
                return today >= startDate && today <= endDate;
            });
        };
        setReservations(parsedReservations)
        // setReservations(parsedReservations.filter((r) => {
        //     const year = new Date(r.start).getFullYear();
        //     return year === selectedYear;
        // }))
        setCurrentOccupants(filterEventsForToday(parsedReservations))
        setFutureReservations(parsedReservations.filter((item) => new Date(item.start) > new Date()));

        // Doluluk oranlarını hesapla
        const occupancy = getOccupancyRate(parsedReservations);
        setOccupancyData(occupancy);
    }, [events]);

    // Takvime etkinlikleri girme
    const range1List = reservations.filter((item) => item.customerName.toLowerCase().includes("room1")).map((item) => {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);

        // 1 gün geri al (başlangıç ve bitiş)
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);

        return {
            start: startDate,
            end: endDate,
        };
    })
    const range2List = reservations.filter((item) => item.customerName.toLowerCase().includes("room2")).map((item) => {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);

        // 1 gün geri al (başlangıç ve bitiş)
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);

        return {
            start: startDate,
            end: endDate,
        };
    })
    const range3List = reservations.filter((item) => item.customerName.toLowerCase().includes("room3")).map((item) => {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);

        // 1 gün geri al (başlangıç ve bitiş)
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);

        return {
            start: startDate,
            end: endDate,
        };
    })


    const range1Includes = (date) => {
        return range1List.some(
            ({ start, end }) => date >= start && date <= end
        );
    };

    const range2Includes = (date) => {
        return range2List.some(
            ({ start, end }) => date >= start && date <= end
        );
    };
    const range3Includes = (date) => {
        return range3List.some(
            ({ start, end }) => date >= start && date <= end
        );
    };


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

    function extractAmountFromText(htmlText) {
        // HTML etiketlerini temizleyerek sadece metni al
        const text = new DOMParser().parseFromString(htmlText, 'text/html').body.textContent;

        // Regex ile "alınacak" kelimesinden önceki miktarı al
        const regex = /(\d+,\d+|\d+)\s*€\s*alınacak/;
        const match = text.match(regex);

        if (match) {
            return match[1] + "€"; // '1250' değeri döndürülür
        } else {
            return null; // Eğer uygun formatta bir veri bulunmazsa null döndürülür
        }
    }
    // musteri Ad-soyad alimi
    function cleanName(text) {
        return text
            .replace(/room\d*/gi, '') // "Room" ya da "room" + opsiyonel rakamları sil
            .replace(/\(\s*room\d*\s*\)/gi, '') // "(room2)" gibi parantezli halleri sil
            .replace(/\broom\b/gi, '') // tek başına "room" kelimesi varsa onu da sil
            .replace(/\(\s*\)/g, '') // boş parantezleri de sil
            .replace(/\s+/g, ' ') // birden fazla boşluğu teke indir
            .trim(); // baştaki ve sondaki boşlukları temizle
    }

    //Room numarasi alma
    function extractAndFormatRooms(text) {
        const matches = text.match(/room\d+/gi); // room1, Room2 gibi eşleşmeleri bul
        if (!matches) return [];

        return matches.map(room => {
            const number = room.match(/\d+/)[0]; // sayıyı al (örnek: "2")
            return ` ${number}`;             // formatla: "Room 2"
        });
    }

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
        <div className="rounded-xl min-h-screen flex flex-col md:flex-row gap-6 pb-4">
            <div className="flex-1 md:w-2/3 space-y-2">
                <div>
                    <StatusRooms events={events} />
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Otel konukları</h2>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search hotel occupants"
                        className="mt-4 w-full border-b-2 border-cyan-300 focus:outline-none p-2 bg-transparent"
                    />
                </div>
                {/* Incoming Occupants */}
                <div className="w-full">
                    <h3 className="font-semibold text-md mb-2">Gelecek konuklar</h3>
                    <div className="">
                        <Swiper
                            className="w-full"
                            spaceBetween={20}
                            loop={true}
                            autoplay={{ delay: 3000 }}
                            breakpoints={{
                                // Mobil (0px - 767px): 1 slide
                                0: {
                                    slidesPerView: 1,
                                },
                                // Tablet ve üzeri (768px+): 2 slide
                                768: {
                                    slidesPerView: 2,
                                },
                            }}
                        >
                            {futureReservations.length > 0 && futureReservations.filter((r) => r.customerName.toLowerCase().includes(searchTerm))
                                .map((client) =>
                                    <SwiperSlide className='p-4' key={client.id}>
                                        <div key={client.id} className={`relative rounded-xl p-4 shadow-[2px_2px_10px_rgba(109,141,173,0.25)] min-w-60 h-full ${client.paymentStatus ? "bg-white text-gray-700" : "bg-[#81D0DF] text-white"}`}>
                                            <div className={`absolute top-3 left-3 lg:mb-2 lg:static w-12 h-12 lg:w-16 lg:h-16 rounded-full mx-auto ${client.paymentStatus ? "bg-[#81D0DF] text-white" : "bg-white text-cyan-600"}  font-bold flex items-center justify-center text-[11px] lg:text-[14px] shadow-lg`} >
                                                {/* <span className="">{cleanName(client.customerName).charAt()}</span> */}
                                                <p className="flex flex-col text-center"><span>Room</span>{extractAndFormatRooms(client.customerName)}</p>
                                            </div>
                                            <div className="text-center flex flex-col items-center">
                                                <p className="font-semibold">{cleanName(client.customerName)}</p>
                                                <p className="text-sm">{moment(client.start).format("MMM DD")} - {moment(client.end).format("MMM DD")}</p>
                                                <p className={`mt-3 px-10 py-1  ${!client.paymentStatus ? "bg-rose-400 text-white" : "bg-[#087592] text-white"} rounded-full  text-sm lg:text-base`}>
                                                    {client.paymentStatus ? "Ödendi" : "Ödeme Bekleniyor"}
                                                </p>
                                                <p className={`text-sm ${client.paymentStatus ? "text-green-600" : "text-stone-800"} mt-1 font-bold`}>{extractAmountFromText(client.desc) || "Misafir"}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )}
                        </Swiper>


                    </div>
                </div >

                <div className="w-full">
                    <h3 className="font-semibold text-md mb-2">Şu anki konuklar</h3>
                    <div className="space-y-4">
                        {currentOccupants.filter((r) => r.customerName.toLowerCase().includes(searchTerm))
                            .map((occupant, i) => (
                                <div key={occupant.id} className={`overflow-hidden pl-4 min-w-60 h-full flex gap-4 items-center relative rounded-xl shadow-[2px_2px_10px_rgba(109,141,173,0.25)]  text-gray-700"`}>
                                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#81D0DF] text-white font-bold flex items-center justify-center text-[11px] lg:text-[14px] shadow-lg`} >
                                        <p className="flex flex-col text-center"><span>Room</span>{extractAndFormatRooms(occupant.customerName)}</p>
                                    </div>
                                    <div className="flex flex-col items-center ">
                                        <p className="font-semibold">{cleanName(occupant.customerName)}</p>
                                        <p className="text-sm">{moment(occupant.start).format("MMM DD")} - {moment(occupant.end).format("MMM DD")}</p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center ml-auto h-20 lg:h-28 w-[28%] border-l-2 border-gray-200 px-4">
                                        <p className={`text-sm ${occupant.paymentStatus ? "text-stone-600" : "text-stone-800"}text-sm lg:text-base mt-1 font-bold`}>{extractAmountFromText(occupant.desc) || "Misafir"}</p>
                                        <p className={`lg:px-6 py-1 text-center  ${!occupant.paymentStatus ? "text-rose-400" : "text-green-600"} font-bold rounded-full text-sm lg:text-md`}>
                                            {occupant.paymentStatus ? "Ödendi" : "Ödeme Bekleniyor"}
                                        </p>

                                    </div>
                                </div>

                            ))}
                    </div>
                </div>
            </div >

            <div className="w-full md:w-1/3 bg-[#F1F6FC] p-4 pb-0 rounded-md lg:rounded-none flex flex-col justify-start gap-8">
                <div className="px-0 lg:px-4 rounded-xl">
                    <div className="flex justify-between mb-2 px-2">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                            <span>Room 1</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                            <span>Room 2</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span>Room 3</span>
                        </div>
                    </div>
                    <Calendar
                        className="rounded-xl overflow-hidden bg-white border-none custom-calendar-1
                                    [&_.react-calendar]:border-none
                                    [&_.react-calendar__tile]:border-none
                                    [&_.react-calendar__month-view__weekdays]:border-none
                                    [&_.react-calendar__month-view__days]:border-none
                                    [&_.react-calendar__navigation]:border-none
                                    [&_.react-calendar__tile--active]:bg-cyan-400 
                                    [&_.react-calendar__tile--active]:text-white 
                                    [&_.react-calendar__tile--now]:bg-cyan-100 
                                    [&_.react-calendar__tile--now]:text-cyan-800
                                    [&_.react-calendar__tile]:rounded-xl 
                                    [&_.react-calendar__tile]:p-2
                                    "
                        onClickDay={() => { }}
                        selectRange={false}
                        value={null}
                        tileContent={({ date, view }) => {
                            if (view !== 'month') return null;

                            const classNames = [];

                            if (range1Includes(date)) classNames.push('bg-red-400');
                            if (range2Includes(date)) classNames.push('bg-yellow-400');
                            if (range3Includes(date)) classNames.push('bg-green-400');

                            return (
                                <div className="flex flex-col gap-0.5 mt-1">
                                    {classNames.map((cls, i) => (
                                        <div key={i} className={`h-1 w-full rounded ${cls}`}></div>
                                    ))}
                                </div>
                            );
                        }}
                    />
                </div>

                <div className="px-0 lg:px-4">
                    <h4 className="font-semibold text-md mb-2">Analiz</h4>
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

                <div className="px-0 lg:px-4">
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
                <AnalyticsWidget />
            </div>
        </div >
    );
}
