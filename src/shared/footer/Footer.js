import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaFacebook, FaVk } from "react-icons/fa";
import { Link } from "react-scroll"; // kendi logonu burada kullan
import logo from '../../assets/images/logo_footer.png';
export default function Footer() {
    const { t } = useTranslation();
    const navLinks = [
        { name: "home", to: "home" },
        { name: "rooms", to: "rooms" },
        { name: "reviews", to: "reviews" },
        { name: "reservation", to: "reservation" },
        { name: "contact", to: "contact" },
    ];
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-stone-800 text-white pt-12 pb-6 px-4 lg:px-16"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {/* Logo */}
                <div className="flex sm:flex-col items-center sm:items-start">
                    <img src={logo} alt="Logo" className="w-28 mb-4" />
                    <p className="text-sm text-gray-400 ml-6 lg:ml-0">
                        {t(`footer.subtitle`)}
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-4">{t(`footer.menu`)}</h3>
                    <ul className="flex flex-col items-center space-y-2 text-gray-300">
                        {navLinks.map((link) => (
                            <li>
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    smooth={true}
                                    duration={500}
                                    className="cursor-pointer hover:text-white"
                                >
                                    {t(`nav.${link.name}`)}
                                </Link>
                            </li>
                        ))}
                        {/* <li><Link to="rooms" smooth duration={500} className="cursor-pointer hover:text-white">Odalar</Link></li>
                        <li><Link to="reservation" smooth duration={500} className="cursor-pointer hover:text-white">Rezervasyon</Link></li>
                        <li><Link to="faq" smooth duration={500} className="cursor-pointer hover:text-white">SSS</Link></li>
                        <li><Link to="contact" smooth duration={500} className="cursor-pointer hover:text-white">İletişim</Link></li> */}
                    </ul>
                </div>

                {/* Social Media */}
                <div className="flex flex-col items-center sm:items-end">
                    <h3 className="text-lg font-semibold mb-4">{t(`footer.socials`)}</h3>
                    <div className="flex space-x-4 text-2xl text-gray-300">
                        <a href="https://instagram.com/monihomesfethiye?igshid=MzNlNGNkZWQ4Mg==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                            <FaInstagram />
                        </a>
                        <a href="https://vk.com/dincugr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                            <FaVk />
                        </a>
                        <a href="https://www.facebook.com/ugurdinc09/?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                            <FaFacebook />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-600 pt-4 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Monihomes. Tüm hakları saklıdır.
            </div>
        </motion.footer>
    );
}
