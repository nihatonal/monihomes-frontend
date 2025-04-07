import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from '../../assets/images/logo_footer.png'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navLinks = [
        { name: "home", to: "home" },
        { name: "rooms", to: "rooms" },
        { name: "reviews", to: "reviews" },
        { name: "reservation", to: "reservation" },
        { name: "contact", to: "contact" },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const handleScrollToReservation = (to) => {
        const element = document.getElementById(to);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            // URL'deki hash (#reservation) kısmını temizle
            window.history.replaceState(null, "", window.location.pathname);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // aşağı kaydırılıyor
                setShowNavbar(false);
            } else {
                // yukarı kaydırılıyor
                setShowNavbar(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <nav

            className={`fixed top-0 w-full z-50 shadow-lg transition-all
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        ${lastScrollY === 0
                    ? "bg-gradient-to-r from-stone-700 via-stone-500 to-stone-400"
                    : "bg-gradient-to-r from-stone-700 via-stone-500 to-stone-400"}
    `}
        >
            <div className="w-full max-w-screen-xl mx-auto flex justify-between items-center py-4 px-4 lg:px-8 xl:px-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white text-2xl font-bold"
                >
                    <a
                        href="#home"
                        aria-label="Ana sayfaya gider"
                        className="block shadow shadow-stone-800 bg-stone-800 p-2 rounded-full"
                    >
                        <img src={logo} className='h-[40px] lg:h-[60px]' alt="Monihomes – Fethiye'de konforlu günlük kiralık dairelerin logosu" />
                    </a>

                </motion.div>

                <div className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <button
                            key={link.to}
                            href={`#${link.to}`}
                            onClick={() => handleScrollToReservation(link.to)}
                            // aria-label={link.to}
                            className="text-white cursor-pointer hover:text-yellow-300 transition"
                        >
                            {t(`nav.${link.name}`)}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <button aria-label="Change language to English" onClick={() => changeLanguage("en")} className="text-white hover:text-yellow-300 transition">EN</button>
                    <button aria-label="Change language to Turkish" onClick={() => changeLanguage("tr")} className="text-white hover:text-yellow-300 transition">TR</button>
                    <button aria-label="Change language to Russian" onClick={() => changeLanguage("ru")} className="text-white hover:text-yellow-300 transition">RU</button>
                    <button
                        className="md:hidden text-white"
                        aria-label="hamburger"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }} // çıkış animasyonu
                    transition={{ duration: 0.3 }}
                    className="md:hidden py-4 pr-10 space-y-4"
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.to}
                            href={`#${link.to}`}
                            aria-label={link.to}
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            className="block text-white text-lg text-right cursor-pointer hover:text-yellow-300 transition"
                        >
                            {t(`nav.${link.name}`)}
                        </a>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
