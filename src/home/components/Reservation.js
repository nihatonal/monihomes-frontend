import React, { useState, useMemo, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { gapi } from 'gapi-script'
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "moment/locale/ru";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useGoogleLogin } from "@react-oauth/google";
import { FaAirbnb, FaGoogle } from "react-icons/fa";

import "moment/locale/tr";

import "./CalendarStyles.css";
const Reservation = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedRange, setSelectedRange] = useState([null, null]);
    const [reservedDates, setReservedDates] = useState([]);
    const [events, setEvents] = useState([]);
    const [token, setToken] = useState(null);
    const calendarID = process.env.REACT_APP_CALENDAR_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    // 1: Ad-Soyad, 2: Check-in/Check-out, 3: Phone/Email
    // Başlangıç Durumu
    const initialState = {
        formStep: 0,
        formValues: {
            name: '',
            guests: 0,
            checkIn: '',
            checkOut: '',
            phone: '',
            email: '',
        },
        errors: {
            phoneError: false,
            emailError: false
        },
        errorMessage: '',
        showFormError: false,
        events: [],
        reservedDates: [],
    };

    useEffect(() => {
        // i18next dilini güncelle
        moment.locale(i18n.language); // Moment dilini de güncelle
    }, [i18n.language]); // i18next dil değiştiğinde çalışacak

    // Reducer Fonksiyonu
    const formReducer = (state, action) => {
        switch (action.type) {
            case "SET_MESSAGE_STEP":
                return { ...state, step: 0, showMessage: true };
            case 'SET_FORM_STEP':
                return { ...state, formStep: action.payload };
            case 'SET_FORM_VALUES':
                return { ...state, formValues: { ...state.formValues, ...action.payload } };
            case 'SET_SHOW_FORM_ERROR':
                return { ...state, showFormError: true, errorMessage: action.payload };
            case 'SET_EVENTS':
                return { ...state, events: action.payload };
            case 'SET_RESERVED_DATES':
                return { ...state, reservedDates: action.payload };
            case 'SET_ERROR':  // Yeni hata tipi
                return {
                    ...state,
                    errors: {
                        ...state.errors,
                        ...action.payload
                    }
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(formReducer, initialState);
    const [errorMessage, setErrorMessage] = useState("");
    const [showFormError, setShowFormError] = useState(false);
    const [prices, setPrices] = useState([])

    //Fiyatlarin mongodb de cekilmesi
    useEffect(() => {
        const fetchPrices = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/prices`);
            const data = await res.json();
            console.log(data)
            setPrices(data); // useState ile saklanacak
        };

        fetchPrices();
    }, []);

    //Fiyatları tek tek tarihlere eşle
    const priceMap = useMemo(() => {
        const map = {};
        prices.forEach(({ startDate, endDate, price }) => {
            let current = new Date(startDate);
            const end = new Date(endDate);
            while (current <= end) {
                const key = current.toISOString().split('T')[0];
                map[key] = price;
                current.setDate(current.getDate() + 1);
            }
        });
        return map;
    }, [prices]);
    //Takvime fiyat ekleme
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateKey = date.toISOString().split('T')[0];
            const today = new Date();
            const isPast = date < new Date(today.setHours(0, 0, 0, 0));
            const price = priceMap[dateKey];

            return !isPast && price ? (
                <div className="text-[10px] text-green-600 font-medium mt-1">€ {price}</div>
            ) : null;
        }
    };


    // Google Calendar'dan dolu tarihleri alacak API çağrısı
    //get events
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
                    const response = await gapi.client.request({
                        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
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

    /// dolu gunlerin tespiti
    const [markedDates, setMarkedDates] = useState([]);
    const [datess, setDatess] = useState([]);

    function expandDates(startDate, stopDate) {
        let dateArray = [];
        let currentDate = moment(new Date(startDate));
        let stop_Date = moment(new Date(stopDate));
        while (currentDate <= stop_Date) {
            dateArray.push(moment(new Date(currentDate)).format("YYYY/MM/DD"));
            currentDate = moment(new Date(currentDate)).add(1, "days");
        }
        return dateArray;
    }

    function compare(a, b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0;
    }

    useEffect(() => {

        const dates = [...new Set([].concat(events && events.map((guest) => expandDates(guest.start.date, guest.end.date).slice(0, -1))))].flat()

        const map = dates.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

        const reserved_ = [...map.entries()].filter((a) => a[1] > 2).sort(compare).flat().filter((a) => a !== 3)

        setDatess(reserved_)

    }, [events])

    let breaks = [0]
    for (let i = 0; i < datess.length; i++) {
        if (i + 1 >= datess.length || moment(new Date(datess[i])).add(1, 'days').format("YYYY/MM/DD") !== moment(new Date(datess[i + 1])).format("YYYY/MM/DD")) {
            breaks.push(i + 1)
        }
    }

    useEffect(() => {
        let index = 0;
        const result = datess.reduce((r, v, i) => {
            if (i >= breaks[index]) {
                r.push([]);
                ++index;
            }
            r[r.length - 1].push(datess[i]);
            return r;
        }, []);

        setReservedDates(result.flat())
        setMarkedDates(result)
    }, [datess])

    let check_in = markedDates.map((x) => x[0]);
    let check_out = markedDates.map((x) => x[x.length - 1]);
    let reserved = datess.filter(x => !check_in.concat(check_out).includes(x));

    //insert event 

    async function inserisciTurni(token) {
        // Kullanıcının ana takvimi
        // const calendarID = "primary"
        var evento = {
            "summary": `Room ön rezervasyon ${state.formValues.name}`,
            "description": `
            Ad-Soyad: ${state.formValues.name}
            Kişi Sayısı:${state.formValues.guests}
            Telefon:${state.formValues.phone}
            Email:${state.formValues.email}
            `,
            "start": {
                "dateTime": `${state.formValues.checkIn}T12:00:00Z`,
                "timeZone": "Europe/Istanbul"
            },
            "end": {
                "dateTime": `${state.formValues.checkOut}T12:00:00Z`,
                "timeZone": "Europe/Istanbul"
            },
            "visibility": "default",
            colorId: "6"
        };

        var res = await axios.post(

            `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
            JSON.stringify(evento),
            { headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
    }

    const handleDateChange = (range) => {
        const [start, end] = range;

        setSelectedRange(range);
        setShowFormError(false);

        state.formValues.checkIn = moment(new Date(start)).format("YYYY-MM-DD")
        state.formValues.checkOut = moment(new Date(end)).format("YYYY-MM-DD")
        // Seçilen aralığın dolu olup olmadığını kontrol et
        const selectedDates = [];
        for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
            selectedDates.push(moment(new Date(d)).format("YYYY/MM/DD"));
        }

        // Eğer seçilen tarih aralığında dolu bir tarih varsa hata mesajı göster

        let checker = (src, target) => target.some((v) => src.includes(v));
        setSelectedDates(selectedDates)

        if (checker(selectedDates, reservedDates)) {
            //    alert("Bu tarihlerde rezervasyon olabilir.")
            setErrorMessage(t("reservation.error.date_unavailable"));
            setShowFormError(true);
            setSelectedDates([])

            setSelectedRange([])
            return
        }
    };



    useEffect(() => {
        setSelectedRange(showFormError ? [] : selectedRange)
    }, [showFormError])

    // Email doğrulama fonksiyonu
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Telefon numarası doğrulama fonksiyonu
    function validatePhone(phone) {
        const phoneRegex = /^\+?[0-9]{10,15}$/;  // + ile başlayabilir ve 10-15 basamaktan oluşmalıdır
        return phoneRegex.test(phone);
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch({
            type: 'SET_FORM_VALUES',
            payload: { [name]: value },
        });
        // Hata kontrolü
        if (name === 'email') {
            const isValidEmail = validateEmail(value);
            dispatch({
                type: 'SET_ERROR',
                payload: { emailError: !isValidEmail }
            });
        }

        if (name === 'phone') {
            const isValidPhone = validatePhone(value);
            dispatch({
                type: 'SET_ERROR',
                payload: { phoneError: !isValidPhone }
            });
        }

    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/reservation", state.formValues);

            if (response.status === 200) {

                dispatch({ type: 'SET_FORM_STEP', payload: 5 });
                inserisciTurni(token);

            } else {
                throw new Error("Rezervasyon başarısız oldu.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }

    };


    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }



    const googleLogin = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar",
        onSuccess: async (tokenResponse) => {

            setToken(tokenResponse.access_token)
            // Google API'den kullanıcı bilgilerini çek
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });

            const userInfo = await res.json();
            dispatch({ type: 'SET_FORM_STEP', payload: 1 });

            state.formValues.name = userInfo.name
            state.formValues.email = userInfo.email
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    return (
        <section id="reservation" className="py-10 lg:py-24 pb-10 ">
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-3xl lg:text-4xl font-bold text-gray-800 text-center px-1 mb-8 lg:mb-16"
            >
                {t('reservation.title')}

            </motion.h2>

            <div className="flex flex-col lg:flex-row lg:justify-around">
                {/* Rezervasyon Formu */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    id='reservationform'
                    className="bg-white p-8 rounded-lg shadow-gray-400 shadow-lg mb-8 lg:mb-0">

                    {state.formStep >= 2 && state.formStep !== 5 &&
                        <h3 className="text-xl font-bold text-gray-700 mb-6">
                            {t('reservation.form_title')}
                        </h3>
                    }

                    {/* Progress bar */}
                    {state.formStep !== 5 && <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${((state.formStep) / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-2 bg-blue-600 rounded-full mb-4"
                    ></motion.div>}

                    {/* Sohbet Tarzında Sorular */}
                    {/* Reservation option */}
                    {state.formStep === 0 &&
                        <div className='max-w-4xl mx-auto px-6 text-center'>
                            <h2 className="text-3xl font-bold mb-6">{t("reservation.option_title")}</h2>
                            <p className="text-gray-600 mb-6">{t("reservation.question")}</p>
                            <div className="flex flex-col justify-center gap-4">
                                <button
                                    onClick={() => window.open("https://tr.airbnb.com/rooms/910566787600271265?check_in=2025-04-22&check_out=2025-04-26&search_mode=regular_search&source_impression_id=p3_1743759994_P3Bojk9bonTKp7Kc&previous_page_section_name=1000&federated_search_id=9478a9ce-60d4-42ba-b4dd-ca7d48de8f80", "_blank")}
                                    className="w-full flex items-center justify-center sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    <FaAirbnb className="font-bold mr-1" />{t("reservation.airbnb")}
                                </button>

                                <button
                                    onClick={() => {
                                        googleLogin()
                                    }}
                                    className="w-full flex items-center justify-center sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    <FaGoogle className="font-bold mr-1" /> {t("reservation.google")}
                                </button>

                                <button
                                    onClick={() => {
                                        dispatch({ type: 'SET_FORM_STEP', payload: 1 })
                                    }}
                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    {t("reservation.form")}
                                </button>
                            </div>
                        </div>}

                    {state.formStep === 1 &&
                        <p className="md:px-[150px] text-center text-md lg:text-xl font-semibold text-gray-700 mb-6">
                            {t('reservation.step0.message')}
                        </p>}


                    {/*  reservartion form */}
                    {state.formStep === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-8 rounded-lg mt-6 ">

                            <div className="mb-4 flex items-center justify-center">
                                <Calendar
                                    onChange={handleDateChange}
                                    value={selectedDates}
                                    selectRange={true}
                                    showDoubleView={windowSize.innerWidth > 786 ? true : false}
                                    showNavigation={true}
                                    showNeighboringMonth={false}
                                    showFixedNumberOfWeeks={false}
                                    allowPartialRange={false}
                                    locale={i18n.language}
                                    tileContent={tileContent}
                                    tileClassName={({ date }) => {
                                        //passed days
                                        if (
                                            moment(date).format("YYYY/MM/DD") <
                                            moment().format("YYYY/MM/DD")
                                        ) {
                                            return "text-gray-400 line-through pointer-events-none";
                                        }

                                        if (selectedDates[0] === moment(date).format("YYYY/MM/DD")
                                            && !check_in.includes(selectedDates[0])
                                            && !reserved.includes(selectedDates[0])

                                        ) {
                                            return "inset-0 bg-[linear-gradient(-45deg,#51c8c2_0%,#51c8c2_50%,#fff_50%,#fff_100%)]"
                                        }

                                        if (selectedDates[selectedDates.length - 1] === moment(date).format("YYYY/MM/DD")
                                            && !reserved.includes(selectedDates[selectedDates.length - 1])

                                        ) {
                                            return "inset-0 bg-[linear-gradient(-225deg,#51c8c2_0%,#51c8c2_50%,#fff_50%,#fff_100%)]"
                                        }
                                        //reserved days
                                        if (check_in.filter((d) => !check_out.includes(d)).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                            return "inset-0 bg-[linear-gradient(-45deg,#fb2c36_0%,#fb2c36_50%,#fff_50%,#fff_100%)] pointer-events-none"
                                        }

                                        if (check_out.filter((d) => !check_in.includes(d)).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                            return "inset-0 bg-[linear-gradient(-225deg,#fb2c36_0%,#fb2c36_50%,#fff_50%,#fff_100%)] pointer-events-none"
                                        }

                                        if (reserved.concat(check_out.filter((d) => check_in.includes(d))).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                            return "inset-0 bg-[linear-gradient(0,#fb2c36_0%,#fb2c36_100%,#fff_100%,#fff_100%)] pointer-events-none"
                                        }


                                        if (selectedDates.slice(1, -1).filter((d) => !reserved.includes(d)).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                            return "bg-[linear-gradient(0deg,#51c8c2_100%,#51c8c2_100%,#fff_0%,#fff_0%)]";
                                        }


                                    }}
                                />


                            </div>
                            <div className="text-center flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 0 })}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    {t('reservation.previous')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 2 })}
                                    disabled={state.formValues.checkIn === '' || state.formValues.checkOut === ''}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer
                    disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-blue-700"
                                >
                                    {t('reservation.next')}
                                </button>
                            </div>
                            {showFormError && (
                                <div className="mt-4 text-red-600 text-center">
                                    {t('reservation.error.date_unavailable')}
                                </div>
                            )}
                        </motion.div>

                    )}

                    {state.formStep === 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 mb-2">
                                    {t('reservation.step1.name')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder={t('reservation.step1.nameholder')}
                                    value={state.formValues.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="guests" className="block text-gray-700 mb-2">
                                    {t('reservation.step1.guests')}
                                </label>
                                <input
                                    type="number"
                                    id="guests"
                                    name="guests"
                                    value={state.formValues.guests}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="text-center flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 1 })}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    {t('reservation.previous')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 3 })}
                                    disabled={state.formValues.name === '' || state.formValues.guests === 0}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer
                    disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-blue-700"
                                >
                                    {t('reservation.next')}
                                </button>
                            </div>

                        </motion.div>
                    )}
                    {state.formStep === 3 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-4" onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 1 })}>
                                <label htmlFor="checkIn" className="block text-gray-700 mb-2">
                                    {t('reservation.step2.checkin')}
                                </label>
                                <input
                                    type="text"
                                    id="checkIn"
                                    name="checkIn"
                                    value={state.formValues.checkIn}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none disabled:bg-white"
                                    required
                                    disabled
                                />
                            </div>
                            <div className="mb-4" onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 1 })}>
                                <label htmlFor="checkOut" className="block text-gray-700 mb-2">
                                    {t('reservation.step2.checkout')}
                                </label>
                                <input
                                    type="text"
                                    id="checkOut"
                                    name="checkOut"
                                    value={state.formValues.checkOut}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none disabled:bg-white "
                                    required
                                    disabled
                                />
                            </div>
                            <div className="text-center flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 2 })}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer"
                                >
                                    {t('reservation.previous')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 4 })}
                                    disabled={state.formValues.checkIn === '' || state.formValues.checkOut === ''}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer
                    disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-blue-700"
                                >
                                    {t('reservation.next')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {/* Submit */}
                    {state.formStep === 4 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700 mb-2">
                                    {t('reservation.step3.phone')}
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder={"+90 555 555 55 55"}
                                    value={state.formValues.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${state.errors.phoneError ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 mb-2">
                                    {t('reservation.step3.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={"monihomes48@gmail.com"}
                                    value={state.formValues.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${state.errors.emailError ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            <div className=" text-center flex justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 3 })}
                                    className="w-44 px-6 py-3 text-sm lg:text-base bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-xl cursor-pointer">
                                    {t('reservation.previous')}
                                </button>
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={state.errors.emailError || state.errors.phoneError}
                                    className="w-44 px-6 text-sm flex items-center justify-center lg:text-base py-3 bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold rounded-lg shadow-md transform transition hover:scale-105 hover:shadow-xl
                                        disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-green-700"
                                >
                                    {!loading ? t('reservation.step3.completed') : <PulseLoader size={8} color={"white"} />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {/* success */}
                    {state.formStep === 5 &&
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col"
                        >
                            <motion.h2
                                className="text-2xl font-semibold text-green-600"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                ✅ {t("reservation.success.message")}
                            </motion.h2>
                            <motion.button
                                className="mt-6 ml-auto px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition"
                                onClick={() => dispatch({ type: 'SET_FORM_STEP', payload: 0 })}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                {t("reservation.success.button")}
                            </motion.button>

                        </motion.div>
                    }
                </motion.div>

                {state.formStep === 0 && <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="hidden lg:block bg-white p-8 rounded-lg shadow-gray-400 shadow-lg ">

                    <div className="mb-4 flex items-center justify-center">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDates}
                            locale={i18n.language}
                            selectRange={true}
                            showDoubleView={windowSize.innerWidth > 786 ? true : false}
                            showNavigation={true}
                            showNeighboringMonth={false}
                            showFixedNumberOfWeeks={false}
                            allowPartialRange={false}
                            tileContent={tileContent}
                            tileClassName={({ date }) => {
                                //passed days
                                if (
                                    moment(date).format("YYYY/MM/DD") <
                                    moment().format("YYYY/MM/DD")
                                ) {
                                    return "text-gray-400 line-through pointer-events-none";
                                }

                                if (selectedDates[0] === moment(date).format("YYYY/MM/DD")
                                    && !check_in.includes(selectedDates[0])
                                    && !reserved.includes(selectedDates[0])

                                ) {
                                    return "inset-0 bg-[linear-gradient(-45deg,#51c8c2_0%,#51c8c2_50%,#fff_50%,#fff_100%)]"
                                }

                                if (selectedDates[selectedDates.length - 1] === moment(date).format("YYYY/MM/DD")
                                    && !reserved.includes(selectedDates[selectedDates.length - 1])

                                ) {
                                    return "inset-0 bg-[linear-gradient(-225deg,#51c8c2_0%,#51c8c2_50%,#fff_50%,#fff_100%)]"
                                }
                                //reserved days
                                if (check_in.filter((d) => !check_out.includes(d)).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                    return "inset-0 bg-[linear-gradient(-45deg,#fb2c36_0%,#fb2c36_50%,#fff_50%,#fff_100%)] pointer-events-none"
                                }

                                if (check_out.filter((d) => !check_in.includes(d)).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                    return "inset-0 bg-[linear-gradient(-225deg,#fb2c36_0%,#fb2c36_50%,#fff_50%,#fff_100%)] pointer-events-none"
                                }

                                if (reserved.concat(check_out.filter((d) => check_in.includes(d))).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                    return "inset-0 bg-[linear-gradient(0,#fb2c36_0%,#fb2c36_100%,#fff_100%,#fff_100%)] pointer-events-none"
                                }


                                if (selectedDates.slice(1, -1).filter((d) => !reserved.includes(d)).find((x) => x === moment(date).format("YYYY/MM/DD"))) {
                                    return "bg-[linear-gradient(0deg,#51c8c2_100%,#51c8c2_100%,#fff_0%,#fff_0%)]";
                                }


                            }}
                        />

                    </div>
                </motion.div>}

            </div>





        </section >
    );
};

export default Reservation;
