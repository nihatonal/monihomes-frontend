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
            <div className="px-2 w-14 h-14 flex items-center justify-center rounded-full text-white bg-red-500 text-center">Room {room.charAt(room.length - 1)}</div>
        ) : (
            <div className="px-2 w-14 h-14 flex items-center justify-center rounded-full  text-white bg-cyan-600 text-center">Room {room.charAt(room.length - 1)}</div>
        );
    };

    return (
        <div className='mb-8 pt-4'>
            <h4 className="text-xl font-semibold text-gray-800 mb-4 ">Bugün - Odalar</h4>
            <div className='flex gap-4'>
                {['room1', 'room2', 'room3'].map((room, i) => (

                    <div className="text-[12px] font-bold" key={room+i}>{renderRoomStatus(room)}</div>

                ))}
            </div>
        </div>
    );
}

export default StatusRooms;