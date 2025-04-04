import { useState, useEffect } from "react";
import axios from "axios";

const calendarID = "your_calendar_id_here"; // Takvim ID'nizi buraya ekleyin

export function InsertEvent({ data }) {
    const [token, setToken] = useState(null);
    const inserisciTurni = async (token) => {
        const evento = {
            summary: data.summary,
            description: data.description,
            start: {
                dateTime: data.startDateTime,
            },
            end: {
                dateTime: data.endDateTime,
            },
        };

        try {
            const res = await axios.post(
                `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
                JSON.stringify(evento),
                {
                    headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                }
            );
            console.log(res.data);
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleLogin = () => {
        const width = 600;
        const height = 600;
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;

        const popup = window.open(
            "http://localhost:5000/login",
            "Google OAuth",
            `width=${width},height=${height},top=${top},left=${left}`
        );

        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer);
                console.log("Popup closed");
            }
        }, 1000);
    };

    useEffect(() => {
        // Listen for messages from the popup

        const messageListener = (event) => {
            // Check the origin for security
            if (event.origin !== 'http://localhost:5000') {
                return;
            }

            // Capture the tokens from the event data
            const { accessToken, refreshToken } = event.data;
            if (accessToken && refreshToken) {
                // console.log('Received Tokens:', accessToken, refreshToken);
                setToken(accessToken);
                inserisciTurni(accessToken)
            }
        };

        window.addEventListener('message', messageListener);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    return { handleLogin, inserisciTurni, data };
}
