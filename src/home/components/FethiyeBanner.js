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
                    <a to="reservation"
                        className="mt-6 inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer"
                        href='#reservation'
                        aria-label="reservasyon yapma"
                    >
                        {t("fethiye.button")}

                    </a>

                </motion.div>

                {/* Image Collage */}
                <div className="lg:w-1/2 hidden lg:block md:h-[320px] lg:h-auto flex justify-center relative w-full">
                    <motion.img
                        src={paspatur}
                        alt="Fethiye Paspatur Çarşısı"
                        className="w-full md:w-72 rounded-lg shadow-gray-400 shadow-lg md:absolute 
                        lg:top-[-60px] left-[0] md:left-20 lg:left-0"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    />
                    <motion.img
                        src={coast}
                        alt="Fethiye Kordon Sahili"
                        className="w-60 md:w-80 rounded-lg shadow-gray-400 shadow-lg absolute 
                        top-20 md:top-16 z-10 hidden md:block lg:top-16  md:right-80 lg:right-0"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    />
                    <motion.img
                        src={fish_restaurant}
                        alt="Fethiye balık hali ve restoranları"
                        className="w-72 rounded-lg hidden md:block shadow-gray-400 shadow-lg absolute 
                        bottom-[36px] right-6 lg:left-26"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                    />
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
                            <img
                                src={paspatur}
                                alt={`Fethiye Paspatur`}
                                className="w-full h-full object-cover  cursor-pointer"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={coast}
                                alt={`Fethiye Sahil kordon yürüyüş yolu`}
                                className="w-full h-full object-cover cursor-pointer"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={fish_restaurant}
                                alt={`Fethiye balık hali`}
                                className="w-full h-full object-cover cursor-pointer"
                            />
                        </SwiperSlide>

                    </Swiper>

                </motion.div>

            </div>
        </section>

    );
}

export default FethiyeBanner;