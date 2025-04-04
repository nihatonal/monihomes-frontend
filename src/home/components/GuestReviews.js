import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import i18n from '../../i18n';
import { useTranslation } from "react-i18next";
import moment from 'moment';

import localeTr from 'moment/locale/tr'
import './Reviews.css'
const reviews_airbnb = [
    {
        source: "Airbnb",
        author_name: "Ziying",
        time: 1719791999,
        rating: 4.9,
        text: "ugur is a very nice host, he help us solve lots of problem and provide good restaurant recommendation. What's more, the room located in a convenice neighborhood which can buy and eat anything there.",
    },
    {
        source: "Airbnb",
        author_name: "Sevgi Gül",
        time: 1719791999,
        rating: 4.8,
        text: "Giriş ve çıkışa kadar çok ilgili ve oda ve konum fethiye için gayet yeterli ve konforlu konum ulaşım ve gezilecek yerlere oldukça yakındı tavsiye dahilinde güzel bir konaklama yeri",
    },
    {
        source: "Airbnb",
        author_name: "Corinne",
        rating: 5,
        time: 1714521600,
        text: "Uğur was quick to respond to questions, met me at the location and recommended places to eat. He is kind and a good host. The location is right downtown and a 5 minute walk from the port, which was the reason I chose this AirBnB.",
    },
    {
        source: "Airbnb",
        author_name: "Steve",
        rating: 5,
        time: 1711929600,
        text: "We really enjoyed our stay here. The host is very friendly and welcoming and also knowledgeable, he is a lovely guy and we look forward to staying here when we return to Fethiye. The room is very nice and new. It is clean and tidy. The location is great, walking distance to all shops and restaurants. Highly recommend staying here it is 10/10. Thank you Ugur",
    },

];

//  const { author_name, rating, text } = review;

export default function GuestReviews() {
    const { t } = useTranslation();
    const [googleReviews, setGoogleReviews] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [lang, setLang] = useState('en');
    // console.log(i18n.language)
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    function addProperty(object, property) {
        object[property] = 'Google';
        return object;
    }

    useEffect(() => {
        // Google Reviews API'den verileri çek
        fetch(`${process.env.REACT_APP_BACKEND_URL}/google_reviews`)
            .then((res) => res.json())
            .then((data) => {
                const result = data.data.result.reviews.map((item) => addProperty(item, "source"))

                setGoogleReviews(result)
            }
            )
            .catch((err) => console.error("Yorumları çekerken hata oluştu:", err));

        // Ekran boyutuna göre layout değiştirme
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        setAllReviews([...googleReviews, ...reviews_airbnb].sort((a, b) => a.time - b.time));
    }, [googleReviews]);
    moment.locale(lang, [localeTr]);

    const getDate = (date) => {
        return moment(new Date(date)).format("MMMM, YYYY")
    }

    const ReviewCard = ({ review, delay }) => {
        const { author_name, rating, text, time, source } = review;
        return (
            <motion.div
                className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col"
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: delay * 0.2 }}
                viewport={{ once: true }}
            >
                <p className="text-gray-600 italic flex-grow">{text}</p>
                <div className="mt-4 flex justify-between items-center">
                    <h4 className="font-semibold text-lg">{author_name}</h4>
                    <span className="text-yellow-500">⭐ {rating}</span>
                </div>
                <p className="text-sm text-gray-400">{source} / {getDate(time * 1000)}</p>
            </motion.div>
        );
    };


    return (
        <section id="reviews" className="bg-gray-50 lg:mb-16 mb-10 rounded-br-[150px] lg:rounded-br-[350px]">
            <div className="container mx-auto py-8 px-6">
                <motion.h2
                    className="text-3xl font-bold text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {t("reviews.title")}

                </motion.h2>

                {isMobile ? (
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true, dynamicBullets: false }}

                        autoplay={{ delay: 3000, disableOnInteraction: false }} // 3 saniyede bir değişir
                        loop={true} // Sonsuz döngüde devam eder
                        spaceBetween={10}
                        slidesPerView={1}
                        className="w-full">
                        {allReviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <ReviewCard review={review} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="grid grid-cols-3  gap-6">
                        <div className="flex flex-col gap-6">
                            {allReviews.slice(0, 3).map((review, index) => (

                                <ReviewCard review={review} delay={index} key={index} />

                            ))}
                        </div>
                        <div className="flex flex-col gap-6">
                            {allReviews.slice(3, 6).map((review, index) => (

                                <ReviewCard review={review} delay={index} key={index} />

                            ))}
                        </div>
                        <div className="flex flex-col gap-6">
                            {allReviews.slice(6, 9).map((review, index) => (

                                <ReviewCard review={review} delay={index} key={index} />

                            ))}
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
}
