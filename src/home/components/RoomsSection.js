import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { motion, AnimatePresence } from "framer-motion";
import { Home, Wifi, Snowflake, WashingMachine, MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";
import { sectionsData } from '../../assets/rooms'
const RoomsSection = () => {
    const { t } = useTranslation();
    const [roomImages, setRoomImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        setRoomImages(sectionsData.monihomes)
    }, []);

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleScrollToReservation = () => {
        const element = document.getElementById("reservation");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            // URL'deki hash (#reservation) kısmını temizle
            window.history.replaceState(null, "", window.location.pathname);
        }
    };
    return (

        <section id="rooms" className=" bg-white">
            <div className="container py-6 lg:py-24 mx-auto px-4 lg:px-8 xl:px-16 flex flex-col-reverse lg:flex-row lg:items-center lg:space-x-12">
                {/* Odaların Temel Özellikleri */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-2/5 bg-white p-8 rounded-b-lg lg:rounded-lg shadow-lg text-left flex flex-col justify-center"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("rooms.title")}</h2>
                    <p className="text-lg text-gray-600 mb-6">{t("rooms.subtitle")}</p>
                    <ul className="space-y-4">
                        <li className="flex items-center space-x-3">
                            <Home className="text-blue-600" />
                            <span className="text-gray-700 font-medium">{t("rooms.features.apartment")}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Snowflake className="text-blue-600" />
                            <span className="text-gray-700 font-medium">{t("rooms.features.ac")}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Wifi className="text-blue-600" />
                            <span className="text-gray-700 font-medium">{t("rooms.features.wifi")}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <WashingMachine className="text-blue-600" />
                            <span className="text-gray-700 font-medium">{t("rooms.features.laundry")}</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <MapPin className="text-blue-600" />
                            <span className="text-gray-700 font-medium">{t("rooms.features.location")}</span>
                        </li>
                    </ul>

                    <button
                        className="px-6 py-3 mt-10 ml-auto bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer"
                        onClick={handleScrollToReservation}
                        aria-label="Rezervasyon"
                    >
                        {t("rooms.cta")}
                    </button>


                </motion.div>
                {/* Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-3/5 mb:0"
                >
                    <Swiper modules={[Navigation]} navigation className="h-[300px] rounded-t-lg lg:h-[450px] lg:rounded-lg shadow-xl">
                        {roomImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={image.image}
                                    alt={`Room oda resimleri ${index + 1}`}
                                    className="w-full h-full object-cover rounded-t-lg lg:rounded-lg cursor-pointer"
                                    onClick={() => openModal(index)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>



            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    >
                        <div className="relative w-full max-w-4xl">
                            <button
                                className="absolute top-4 right-4 text-white z-20 text-3xl cursor-pointer focus:outline-none hover:opacity-75"
                                onClick={closeModal}
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <Swiper modules={[Navigation]} navigation initialSlide={selectedImageIndex} className="w-full h-[90vh]">
                                {roomImages.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={image.image} alt={`Room ${index + 1}`} className="w-full h-full object-contain" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>

    );
};

export default RoomsSection;

