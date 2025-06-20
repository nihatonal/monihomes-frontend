import React, { useEffect } from 'react';
import {
    KeyRound, Wifi, Fan, ShieldCheck, WashingMachine, BedDouble,
    CigaretteOff, Music2, Clock, SprayCan
} from "lucide-react";
import { FaToiletPaper } from "react-icons/fa6";
import { GiSlippers } from "react-icons/gi";
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import Footer from '../footer/Footer';
const RoomInstructions = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const icons = [
        <KeyRound size={28} className="text-amber-600" />,
        <Wifi size={28} className="text-blue-500" />,
        <Fan size={28} className="text-cyan-500" />,
        <ShieldCheck size={28} className="text-green-600" />,
        <FaToiletPaper size={28} className="text-gray-600" />,
        <WashingMachine size={28} className="text-indigo-600" />,
        <Clock size={28} className="text-pink-600" />,
        <BedDouble size={28} className="text-rose-500" />,
        <CigaretteOff size={28} className="text-red-500" />,
        <Music2 size={28} className="text-purple-500" />,
        <GiSlippers size={28} className="text-yellow-600" />,
        <GiSlippers size={28} className="text-yellow-800" />,
        <SprayCan size={28} className="text-emerald-500" />,
        <Clock size={28} className="text-teal-500" />
    ];

    const instructionItems = t('roomInstructions.items', { returnObjects: true });

    return (
        <>        <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="relative flex items-center gap-4 mb-6">
                    <NavLink to="/" className={"absolute -top-2 hover:text-blue-800"}>{t('nav.home')}</NavLink>
                    <div className="flex-1 h-px bg-gray-300" />
                    <h1 className="text-4xl font-bold text-center whitespace-nowrap">
                        {t('roomInstructions.title')}
                    </h1>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                <p className="text-center text-gray-600 mb-10">
                    {t('roomInstructions.subtitle')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructionItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="shrink-0">{icons[index]}</div>
                            <p className="text-gray-800">
                                {Array.isArray(item) ? (
                                    <>
                                        {item[0]} <br /> {item[1]}
                                    </>
                                ) : item}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-lg">
                    {t('roomInstructions.closing')}
                </div>
            </div>

        </div>
            <Footer />
        </>

    );
};

export default RoomInstructions;
