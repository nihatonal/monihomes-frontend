import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
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

            className={`fixed top-0 w-full px-6 shadow-lg z-50 transition-all 
            hover:bg-gradient-to-r hover:from-stone-700 hover:via-stone-500 hover:to-stone-400  
            ${showNavbar ? "translate-y-0 " : "-translate-y-full"}
            ${lastScrollY === 0 ? " bg-transparent transition-all " : "bg-gradient-to-r from-stone-700 via-stone-500 to-stone-400 transition-all "}
            `}
        >
            <div className="container mx-auto flex justify-between items-center 
            py-4 px-4 pl-0 lg:px-8 xl:px-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white text-2xl font-bold"
                >
                    <Link
                        to={"home"}
                        smooth={true}
                        duration={500}
                        className="block shadow shadow-stone-800 bg-stone-800 p-2 rounded-full"
                    >
                        <img src={logo} className='h-[40px] lg:h-[60px]' alt='monihomes-fethiye-logo' />
                    </Link>

                </motion.div>

                <div className="hidden md:flex space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            className="text-white cursor-pointer hover:text-yellow-300 transition"
                        >
                            {t(`nav.${link.name}`)}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={() => changeLanguage("en")} className="text-white hover:text-yellow-300 transition">EN</button>
                    <button onClick={() => changeLanguage("tr")} className="text-white hover:text-yellow-300 transition">TR</button>
                    <button onClick={() => changeLanguage("ru")} className="text-white hover:text-yellow-300 transition">RU</button>
                    <button
                        className="md:hidden text-white"
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
                    transition={{ duration: 0.3 }}
                    className="md:hidden p-4 space-y-4"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            className="block text-white text-lg cursor-pointer hover:text-yellow-300"
                            onClick={() => setIsOpen(false)}
                        >
                            {t(`nav.${link.name}`)}
                        </Link>
                    ))}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
