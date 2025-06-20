import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import hero_bg from "../../assets/images/hero_background_otel_odasi.jpg"

const Hero = () => {
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
        <section id="home" className="relative w-full h-screen bg-white ">
            <div
                className="relative w-full h-full flex flex-col justify-center items-center text-center text-white p-4 
            px-4 lg:px-8 xl:px-16 rounded-b-[350px] rounded-br-[0] 
            before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/60 before:to-transparent before:rounded-b-[350px] before:rounded-br-[0]"
                style={{
                    backgroundImage: `url(${hero_bg})`,
                    backgroundSize: "cover", // Resmi ekranın tamamına sığdırır.
                    backgroundPosition: "center", // Resmi ortalar.
                    backgroundRepeat: "no-repeat", // Resmin tekrar etmesini engeller.
                }}
            >
                <motion.h1
                    className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight drop-shadow-lg"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {t("hero.title")}
                </motion.h1>

                <motion.p
                    className="text-md sm:text-xl mt-4 mb-6 drop-shadow-md"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {t("hero.subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >

                    <button onClick={handleScrollToReservation} aria-label="reservasyon yapma" className="relative z-90 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg">
                        {t("hero.cta")}
                    </button>

                </motion.div>
            </div>
        </section >

    );
};

export default Hero;
