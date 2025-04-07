import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import { gapi } from 'gapi-script';
import AdminPrice from "./sections/AdminPrice";
import Reservations from "./sections/Reservations";
import StatusRooms from "./components/StatusRooms";
import PriceSummary from "./components/PriceSummary";
import PriceDashboard from "./components/PriceDashboard";
const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [events, setEvents] = useState([]);
    const token = localStorage.getItem("token"); // Token’ı al
    const [activeSection, setActiveSection] = useState("dashboard");
    const [prices, setPrices] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchProtectedData = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/protected`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            setData(result.message);
        };

        if (token) {
            fetchProtectedData();
        }
    }, [token]);
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
    // Fiyatları çekme
    const fetchPrices = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/prices`);
            setPrices(response.data);
        } catch (err) {
            console.error('Fiyatlar alınırken hata oluştu:', err);
        }
    };
    useEffect(() => {
        fetchPrices();
    }, [activeSection]);


    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/admin/login"; // Giriş sayfasına yönlendir
    };

    const uniquePrices = [...new Set(prices.map(item => item.price))];
    const highestPrice = Math.max(...prices.map(item => item.price));
    const lowestPrice = Math.min(...prices.map(item => item.price));

    // Süre = (endDate - startDate) gün olarak
    const longestRange = prices.reduce((longest, current) => {
        const duration = new Date(current.endDate) - new Date(current.startDate);
        return duration > longest.duration
            ? { ...current, duration }
            : longest;
    }, { duration: 0 });

    // Bugünden sonraki en yakın başlangıç tarihi
    const today = new Date();
    const upcoming = prices
        .filter(item => new Date(item.startDate) > today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

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
    const year = new Date();

    return (
        <div className="lg:flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`absolute lg:static w-64 bg-white shadow-xl p-6 space-y-6 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300`}>
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => {
                            setMenuOpen(false)
                            setActiveSection("dashboard")
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeSection === "dashboard" ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        📊 İstatistikler
                    </button>
                    <button
                        onClick={() => {
                            setMenuOpen(false)
                            setActiveSection("prices")
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeSection === "prices" ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        <FaMoneyBillWave className="text-lg" />
                        Fiyat Yönetimi
                    </button>
                    <button
                        onClick={() => {
                            setMenuOpen(false)
                            setActiveSection("reservations")
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeSection === "reservations" ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                        <FaCalendarAlt className="text-lg" />
                        Rezervasyonlar
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-10 text-red-600 hover:underline text-sm"
                >
                    Çıkış Yap
                </button>
            </aside>

            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden absolute top-4 right-4 p-2 text-gray-600"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                )}
            </button>

            {/* Main Content */}
            <main className="w-full p-6 overflow-y-auto bg-gray-50">
                {activeSection === "dashboard" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-6">Hoşgeldiniz 👋</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Oda Durumları */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <StatusRooms events={events} />
                            </div>

                            {/* Farklı Fiyat Sayısı */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <PriceSummary uniquePrices={uniquePrices} />
                            </div>

                            {/* En Uzun Süreli Fiyat Aralığı */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">⏱️ En Uzun Süreli Fiyat Aralığı</h4>

                                {longestRange.startDate ? (
                                    <div className="flex flex-col gap-4 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500 text-base">📅 Tarihler:</span>
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                {new Date(longestRange.startDate).toLocaleDateString("tr-TR")} – {new Date(longestRange.endDate).toLocaleDateString("tr-TR")}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-purple-500 text-base">🕒 Süre:</span>
                                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                                {longestRange.duration / (1000 * 60 * 60 * 24)} gün
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-green-500 text-base">💰 Fiyat:</span>
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                                                {longestRange.price.toLocaleString()} €
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Veri bulunamadı.</p>
                                )}
                            </div>


                            {/* En Yüksek ve En Düşük Fiyat */}
                            <div className="bg-white p-6 rounded-xl md:col-span-2 shadow-md hover:shadow-lg transition-shadow">
                                <PriceDashboard priceData={prices} />
                            </div>

                            {/* Toplam Rezervasyonlar */}
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <h4 className="text-gray-800 font-semibold mb-2">Toplam Rezervasyon</h4>
                                <div className="flex flex-wrap gap-4 justify-start">
                                    {Object.entries(reservationsPerYear)
                                        .sort((a, b) => b[0] - a[0])
                                        .map(([year, count]) => (
                                            <div
                                                key={year}
                                                className="flex items-center w-full justify-center p-2 justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform"
                                            >
                                                <p className="text-base sm:text-xl font-bold">
                                                    {year}
                                                    <span className=" text-base sm:text-xl mx-1">/</span>
                                                </p>

                                                <div className="flex items-center">
                                                    <p className="text-xs sm:text-sm ml-1 ">Rezervasyon</p>
                                                    <span className=" text-base sm:text-xl mx-1">-</span>
                                                    <p className="text-lg sm:text-2xl font-semibold">{count}</p>
                                                </div>
                                            </div>

                                        ))}

                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {
                    activeSection === "prices" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Fiyat Yönetimi</h1>
                            {data && <AdminPrice />}
                        </div>
                    )
                }

                {
                    activeSection === "reservations" && (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Rezervasyon Yönetimi</h1>
                            {data && <Reservations />}
                        </div>
                    )
                }
            </main >
        </div >


    );
};

export default AdminDashboard;
