import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import { gapi } from 'gapi-script';
import AdminPrice from "./sections/AdminPrice";
import Reservations from "./panels/Reservations";
import StatusRooms from "./components/StatusRooms";
import PriceSummary from "./components/PriceSummary";
import PriceDashboard from "./components/PriceDashboard";
import Dashboard from "./Dashboard";
import Analytic from "./panels/Analytic";

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [events, setEvents] = useState([]);
    const token = localStorage.getItem("token"); // Token’ı al
    const [activeSection, setActiveSection] = useState("reservations");
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
                    //lconsole.log(events.filter((item) => item.summary.toLowerCase().includes("room")))
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

    return (
        <div className="lg:flex min-h-screen">
            {/* Sidebar */}
            <aside className={`absolute z-[90] lg:static w-64 bg-white border-r-gray-200 border-2 p-6 space-y-6 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300`}>
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <nav className="space-y-4">
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
                    <button
                        onClick={() => {
                            setMenuOpen(false)
                            setActiveSection("analytic")
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
            <main className="w-full overflow-y-auto">
                <div className="p-4 border-b-2 border-gray-200">Header</div>
                {activeSection === "dashboard" && (
                    <div>
                        <div className="px-4 lg:px-10 lg:pr-0">
                            <Dashboard events={events} />
                        </div>
                    </div>
                )}
                {activeSection === "analytic" && (
                    <div className="">
                        <h1 className="px-4 pt-2 text-2xl font-bold mb-4">İstatistikler</h1>
                        <div className="">
                            <Analytic events={events} />
                        </div>
                    </div>
                )}
                {
                    activeSection === "prices" && (
                        <div>
                            <h1 className="text-2xl font-bold p-4">Fiyat Yönetimi</h1>
                            {data && <AdminPrice />}
                        </div>
                    )
                }

                {
                    activeSection === "reservations" && (
                        <div>
                            <h1 className="px-4 pt-2 text-2xl font-bold mb-4">Rezervasyon Yönetimi</h1>
                            {data && <Reservations events={events} />}
                        </div>
                    )
                }
            </main >
        </div >


    );
};

export default AdminDashboard;
