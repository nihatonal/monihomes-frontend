import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';
import coast from '../../assets/images/fethiye-yürüyüş-kordon-sahil-yolu.jpg';
import paspatur from '../../assets/images/Fethiye-paspatur-çarşısı.webp';
import fish_restaurant from '../../assets/images/fethiye-balık-hali.jpg'


import './Banner.css'
function FethiyeBanner(props) {
    const { t } = useTranslation();
    const handleScrollToReservation = () => {
        const element = document.getElementById("reservation");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            // URL'deki hash (#reservation) kısmını temizle
            window.history.replaceState(null, "", window.location.pathname);
        }
    };
    return (
        <section className="relative py-6 lg:py-24 px-6 lg:px-20 shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2 text-center lg:text-left"
                >
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        {t("fethiye.title")}
                    </h2>
                    <p className="mt-4 text-lg text-gray-700">
                        {t("fethiye.description")}
                    </p>
                    <button
                        className="mt-6 inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer"
                        onClick={handleScrollToReservation}
                        aria-label="reservasyon yapma"
                    >
                        {t("fethiye.button")}

                    </button>

                </motion.div>

                {/* Image Collage */}
                <div className="lg:w-1/2 hidden lg:block md:h-[320px] lg:h-auto flex justify-center relative w-full">

                    <motion.div
                        className="w-full md:w-72 rounded-lg shadow-gray-400 shadow-lg md:absolute 
                        lg:top-[-120px] left-[0] md:left-20 lg:left-0 "
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <img
                            // src={"https://i.ibb.co/SDDqxYJF/Fethiye-paspatur-ar-s.webp"}
                            src={paspatur}
                            alt="Fethiye Paspatur Çarşısı"
                        />
                        <p className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800 shadow-md">
                            {t("fethiye.paspatur")} <br />
                            <span className="text-xs font-medium text-gray-600">1 {t("fethiye.walking_distance")}</span>
                        </p>

                    </motion.div>
                    <motion.div
                        className="w-60 md:w-80 rounded-lg shadow-gray-400 shadow-lg absolute 
                    lg:top-[25px] z-10 hidden md:block lg:top-16  md:right-80 lg:right-0"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <img
                            // src={"https://i.ibb.co/k6vJQjms/fethiye-oludeniz.webp"}
                            src={coast}
                            alt="Fethiye Kordon Sahili"
                        />
                        <p className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800 shadow-md">
                            {t("fethiye.coastal")} <br />
                            <span className="text-xs font-medium text-gray-600">2 {t("fethiye.walking_distance")}</span>
                        </p>
                    </motion.div>
                    <motion.div
                        className="w-72 rounded-lg hidden md:block shadow-gray-400 shadow-lg absolute 
                    bottom-[32px] right-6 lg:right-[-60px]"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <img
                            // src={"https://i.ibb.co/hJgz4gvP/fethiye-bal-k-hali.webp"}
                            src={fish_restaurant}
                            alt="Fethiye balık hali ve restoranları"

                        />
                        <p className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800 shadow-md">
                            {t("fethiye.fish_restaurants")} <br />
                            <span className="text-xs font-medium text-gray-600">1 {t("fethiye.walking_distance")}</span>
                        </p>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className=" lg:hidden lg:w-1/2 md:h-[320px] lg:h-auto flex justify-center relative w-full">
                    <Swiper modules={[Autoplay]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }} // 3 saniyede bir değişir
                        loop={true} // Sonsuz döngüde devam eder
                        spaceBetween={10}
                        slidesPerView={1} // Number of slides to show per view
                        slidesPerGroup={1} // Space between slides
                        loopAdditionalSlides={1} // Duplicate additional slides to enable proper loop
                        className="shadow-xl">
                        <SwiperSlide>
                            <div>
                                <img
                                    src={paspatur}
                                    alt={`Fethiye Paspatur`}
                                    className="w-full h-full object-cover  cursor-pointer"
                                />
                                <p className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800 shadow-md">
                                    {t("fethiye.paspatur")} <br />
                                    <span className="text-xs font-medium text-gray-600">1 {t("fethiye.walking_distance")}</span>
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className='grid'>
                                <img
                                    src={coast}
                                    alt={`Fethiye Sahil kordon yürüyüş yolu`}
                                    className="w-full h-full object-cover cursor-pointer"
                                />
                                <p className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800 shadow-md">
                                    {t("fethiye.coastal")} <br />
                                    <span className="text-xs font-medium text-gray-600">2 {t("fethiye.walking_distance")}</span>
                                </p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div>
                                <img
                                    src={fish_restaurant}
                                    alt={`Fethiye balık hali`}
                                    className="w-full h-full object-cover cursor-pointer"
                                />
                                <p className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-sm font-semibold text-gray-800 shadow-md">
                                    {t("fethiye.fish_restaurants")} <br />
                                    <span className="text-xs font-medium text-gray-600">1 {t("fethiye.walking_distance")}</span>
                                </p>
                            </div>

                        </SwiperSlide>

                    </Swiper>

                </motion.div>

            </div>
        </section>

    );
}

export default FethiyeBanner;