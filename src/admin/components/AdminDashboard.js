import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import AdminPrice from "./AdminPrice";
const AdminDashboard = () => {
    const [data, setData] = useState(null);
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
    }, []);


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
    return (
        <div className="lg:flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`absolute lg:static w-64 bg-white shadow-lg p-6 space-y-6 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300`}>
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setActiveSection("dashboard")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeSection === "dashboard"
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700"
                            }`}
                    >
                        📊 İstatistikler
                    </button>
                    <button
                        onClick={() => setActiveSection("prices")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeSection === "prices"
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700"
                            }`}
                    >
                        <FaMoneyBillWave className="text-lg" />
                        Fiyat Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveSection("reservations")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeSection === "reservations"
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-gray-100 text-gray-700"
                            }`}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Farklı Fiyat Sayısı */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h4 className="text-gray-800 font-semibold mb-2">Farklı Fiyat Sayısı</h4>
                                <p className="text-2xl text-indigo-600 font-bold">{uniquePrices.length}</p>
                                <ul className="mt-2 text-gray-600 text-sm space-y-1 list-disc list-inside max-h-32 overflow-y-auto">
                                    {uniquePrices.map((p, i) => <li key={i}>{p.toLocaleString()} ₺</li>)}
                                </ul>
                            </div>

                            {/* En Yüksek ve En Düşük Fiyat */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h4 className="text-gray-800 font-semibold mb-2">Fiyat Aralığı</h4>
                                <p className="text-gray-600">🔼 En Yüksek: <span className="font-bold">{highestPrice.toLocaleString()} ₺</span></p>
                                <p className="text-gray-600">🔽 En Düşük: <span className="font-bold">{lowestPrice.toLocaleString()} ₺</span></p>
                            </div>

                            {/* En Uzun Süreli Fiyat Aralığı */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h4 className="text-gray-800 font-semibold mb-2">En Uzun Süreli Fiyat Aralığı</h4>
                                {longestRange.startDate && (
                                    <>
                                        <p className="text-gray-600">📅 {longestRange.startDate.slice(0, 10)} – {longestRange.endDate.slice(0, 10)}</p>
                                        <p className="text-gray-600">🕒 Süre: <span className="font-bold">{longestRange.duration / (1000 * 60 * 60 * 24)} gün</span></p>
                                        <p className="text-gray-600">💰 Fiyat: {longestRange.price.toLocaleString()} ₺</p>
                                    </>
                                )}
                            </div>

                            {/* Gelecek İlk Fiyat Aralığı */}
                            <div className="bg-white p-6 rounded-xl shadow-md ">
                                <h4 className="text-gray-800 font-semibold mb-2">Yaklaşan İlk Fiyat</h4>
                                {upcoming ? (
                                    <>
                                        <p className="text-gray-600">📅 {upcoming.startDate.slice(0, 10)} – {upcoming.endDate.slice(0, 10)}</p>
                                        <p className="text-gray-600">💰 Fiyat: <span className="font-bold">{upcoming.price.toLocaleString()} ₺</span></p>
                                    </>
                                ) : (
                                    <p className="text-gray-500 italic">Yaklaşan bir fiyat aralığı yok.</p>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md ">
                                <p className="text-sm text-gray-500">Toplam Rezervasyon</p>
                                <p className="text-xl font-bold text-gray-800">0</p>
                            </div>
                        </div>


                    </div>
                )}

                {activeSection === "prices" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Fiyat Yönetimi</h1>
                        {data && <AdminPrice />}
                    </div>
                )}

                {activeSection === "reservations" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Rezervasyon Yönetimi</h1>
                        <p className="text-gray-600">Yakında eklenecek...</p>
                    </div>
                )}
            </main>
        </div>


    );
};

export default AdminDashboard;
