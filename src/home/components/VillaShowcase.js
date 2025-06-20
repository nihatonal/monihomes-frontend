import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaInstagram } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import barkin_1 from '../../assets/images/Villas/webp/barkin-villa-bedroom-fethiye.webp';
import barkin_2 from '../../assets/images/Villas/webp/barkin-villa-fethiye.webp';
import barkin_3 from '../../assets/images/Villas/webp/barkin-villa-jakuzi-fethiye.webp';
import barkin_4 from '../../assets/images/Villas/webp/barkin-villa-kitchen-fethiye.webp';
import villamasal_1 from '../../assets/images/Villas/webp/villamasal_2.webp';
import villamasal_2 from '../../assets/images/Villas/webp/villamasal_3.webp'
import villamasal_3 from '../../assets/images/Villas/webp/villamasal_5.webp'
import villamasal_4 from '../../assets/images/Villas/webp/villamasal_9.webp'
import villamasal_5 from '../../assets/images/Villas/webp/villamasal_11.webp'
const villas = [
    {
        id: 1,
        images: [barkin_1, barkin_2, barkin_3, barkin_4],
        // images: ["https://i.ibb.co/DPXLrt4v/barkin-villa-bedroom-fethiye.webp",
        //     "https://i.ibb.co/LVXx8s3/barkin-villa-fethiye.webp",
        //     "https://i.ibb.co/d08Hg7h0/barkin-villa-jakuzi-fethiye.webp",
        //     "https://i.ibb.co/GvJTDPYm/barkin-villa-kitchen-fethiye.webp"],
        titleKey: 'villa1.title',
        descKey: 'villa1.description',
        link: "https://www.instagram.com/barkinvillafethiye?igsh=MW5naHplNDNqZGwzMQ%3D%3D&utm_source=qr"
    },
    {
        id: 2,
        images: [villamasal_1, villamasal_2, villamasal_3, villamasal_4, villamasal_5],
        // images: ["https://i.ibb.co/MyNfRrbc/villamasal-2.webp",
        //     "https://i.ibb.co/tMh7jsbQ/villamasal-3.webp",
        //     "https://i.ibb.co/7tfjrmxS/villamasal-5.webp",
        //     "https://i.ibb.co/nT2Sb05/villamasal-9.webp",
        //     "https://i.ibb.co/ZR5TcNZS/villamasal-11.webp"],
        titleKey: 'villa2.title',
        descKey: 'villa2.description',
        link: "https://www.instagram.com/villamasalfethiye?igsh=ZjZiYjhpbjZjZmZn&utm_source=qr"
    },
];

export default function VillaShowcase() {
    const { t } = useTranslation();

    return (
        <section className="py-24 px-6 lg:px-12 xl:px-20 bg-[#f9f9f9]">
            <div className="w-full mx-auto ">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                >
                    {t('villaSection.title')}
                </motion.h2>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-20">
                    {villas.map((villa, index) => (
                        <motion.div
                            key={villa.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row md:items-center gap-8"
                        >
                            {/* SLIDER */}
                            <div className="w-full md:w-1/2">
                                <Swiper
                                    spaceBetween={20}
                                    pagination={{ clickable: true }}
                                    modules={[Autoplay, Pagination]}
                                    autoplay={{
                                        delay: 3000 * (index + 1) / 2, // 3 saniyede bir geçiş
                                        disableOnInteraction: false, // kullanıcı kaydırsa bile devam etsin
                                    }}
                                    loop={true} // sonsuz döngü için
                                    className="rounded-xl overflow-hidden shadow-md"
                                >
                                    {villa.images.map((imgSrc, i) => (
                                        <SwiperSlide key={i}>
                                            <img
                                                src={imgSrc}
                                                alt={`Villa ${villa.id} - Slide ${i + 1}`}
                                                className="w-full h-52 object-cover"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* TEXT */}
                            <div className="w-full md:w-1/2 text-center md:text-left px-2">
                                <h3 className="text-2xl font-semibold mb-3">{t(villa.titleKey)}</h3>
                                <p className="mb-4 text-gray-600">{t(villa.descKey)}</p>
                                <a
                                    href={villa.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-2 rounded-full shadow hover:scale-105 transition"
                                >
                                    <FaInstagram className="text-lg" />
                                    {t('villaSection.cta')}
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
