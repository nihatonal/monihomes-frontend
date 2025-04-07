import React, { useEffect, useState } from 'react';

function StatusRooms({ events }) {
    const [roomStatus, setRoomStatus] = useState({
        room1: false,
        room2: false,
        room3: false,
    });
    //Oda doluluk durumu 
    useEffect(() => {
        if (!events.length) return;

        const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format

        const newStatus = {
            room1: false,
            room2: false,
            room3: false,
        };

        events.forEach(event => {
            const summary = event.summary?.toLowerCase();
            const start = event.start.date;
            const end = event.end.date;

            // Bugünkü tarih aralığında mı?
            const isOngoing = today >= start && today < end;

            if (isOngoing) {
                if (summary.includes('room1')) newStatus.room1 = true;
                if (summary.includes('room2')) newStatus.room2 = true;
                if (summary.includes('room3')) newStatus.room3 = true;
            }
        });

        setRoomStatus(newStatus);
    }, [events]);

    const renderRoomStatus = (room) => {
        const isReserved = roomStatus[room];
        return isReserved ? (
            <div className="p-2 text-white rounded-md bg-red-500 text-center">Dolu</div>
        ) : (
            <div className="p-2 text-white rounded-md bg-green-500 text-center">Boş</div>
        );
    };

    return (
        <div>
            <h4 className="text-gray-800 font-semibold text-lg mb-4">Odaların Durumu - Bugün</h4>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>


                {['room1', 'room2', 'room3'].map((room) => (
                    <div
                        key={room}
                        className="bg-white px-4 py-3 rounded-lg shadow-sm sm:shadow-md sm:px-6 sm:py-6"
                    >
                        <h4 className="text-gray-800 font-medium text-base sm:text-lg mb-1 sm:mb-2">
                            {room.toUpperCase()}
                        </h4>
                        <div className="text-sm sm:text-base">{renderRoomStatus(room)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatusRooms;