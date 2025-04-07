import React,{useEffect,useState} from 'react';

function ReservationList({events}) {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    //Rezervasyon listesi
    useEffect(() => {
        const parsedReservations = events.map((event) => {
            const paymentStatuses = ["ödeme alındı", "ödendi", "ödeme yapıldı"];
            const customerName = event.summary || "İsimsiz";
            const email = event.creator?.email || "Bilinmiyor";
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

                paymentStatus: paymentStatuses.some(status => event.description?.toLowerCase().includes(status)) ?? false,
            };
        });

        setReservations(parsedReservations);
    }, [events]);

    // Arama fonksiyonu
    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

    // Yıllık filtreleme
    const filteredReservations = reservations
        .filter((r) => {
            const year = new Date(r.start).getFullYear();
            return year === selectedYear;
        })
        .filter((r) => r.customerName.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div>
            <h4 className="text-gray-800 font-semibold mb-4 text-lg">Rezervasyonlar</h4>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Müşteri adı ara..."
                    className="p-3 border border-gray-300 rounded-md w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    onChange={handleSearch}
                    value={searchTerm}
                />

                <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="p-3 border border-gray-300 rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={year} value={year}>{year}</option>;
                    })}
                </select>
            </div>

            <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredReservations.map((reservation) => (
                    <li key={reservation.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                                <p className="font-semibold text-indigo-600">{reservation.customerName}</p>
                                <p className="text-sm text-gray-500">{reservation.room}</p>
                                <p className="text-sm text-gray-500">
                                    {reservation.start} → {reservation.end}
                                </p>
                            </div>

                            <div className="text-sm font-medium">
                                {reservation.paymentStatus ? (
                                    <span className="text-green-600">💰 Ödeme Tamamlandı</span>
                                ) : (
                                    <span className="text-yellow-600">⌛ Ödeme Bekleniyor</span>
                                )}
                            </div>

                            <button
                                onClick={() => alert(`Rezervasyon Detayı:\n${JSON.stringify(reservation, null, 2)}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                                Detaylar
                            </button>
                        </div>
                    </li>
                ))}

                {filteredReservations.length === 0 && (
                    <p className="text-gray-400 text-sm italic">Seçilen yıla ait rezervasyon bulunamadı.</p>
                )}
            </ul>
        </div>
    );
}

export default ReservationList;