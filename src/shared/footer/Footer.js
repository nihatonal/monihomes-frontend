import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaFacebook, FaAirbnb, FaTiktok } from "react-icons/fa";
import { NavLink } from "react-router";
import logo from "../../assets/images/logo_footer.png";
import { useTranslatedPath } from "../hooks/useTranslatedPath";
export default function Footer() {
  const { t } = useTranslation();
  const navLinks = [
    { name: "home", to: "home" },
    { name: "rooms", to: "rooms" },
    { name: "reviews", to: "reviews" },
    { name: "reservation", to: "reservation" },
  ];

  const handleScrollToReservation = (to) => {
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // URL'deki hash (#reservation) kısmını temizle
      window.history.replaceState(null, "", window.location.pathname);
    }
  };
  const roomPath = useTranslatedPath("roomInstructions");
  // <Link to={roomPath}>Room Instructions</Link>
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
          <img src={logo} alt="monihomes logo" className="w-28 mb-4" />
          <p className="text-sm text-gray-400 ml-6 lg:ml-0">
            {t(`footer.subtitle`)}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">{t(`footer.menu`)}</h3>
          <ul className="flex flex-col items-center space-y-2 text-gray-300">
            {navLinks.map((link) => (
              <li key={link.to}>
                <button
                  key={link.to}
                  onClick={() => handleScrollToReservation(link.to)}
                  aria-label={link.to}
                  className="cursor-pointer hover:text-white"
                >
                  {t(`nav.${link.name}`)}
                </button>
              </li>
            ))}
            <li>
              <NavLink
                to={roomPath}
                className="cursor-pointer hover:text-white"
              >
                {t(`nav.instructions`)}
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center sm:items-end">
          <h3 className="text-lg font-semibold mb-4">{t(`footer.socials`)}</h3>
          <div className="flex space-x-4 text-2xl text-gray-300">
            <a
              href="https://instagram.com/monihomesfethiye?igshid=MzNlNGNkZWQ4Mg=="
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              aria-label="airbnb"
              href="https://tr.airbnb.com/rooms/910566787600271265?check_in=&check_out=&search_mode=regular_search&source_impression_id=p3_1743759994_P3Bojk9bonTKp7Kc&previous_page_section_name=1000&federated_search_id=9478a9ce-60d4-42ba-b4dd-ca7d48de8f80"
              rel="noreferrer"
              target="_blank"
              className="text-2xl"
            >
              <FaAirbnb className="hover:text-white transition" />
            </a>
            <a
              href="https://www.facebook.com/ugurdinc09/?mibextid=ZbWKwL"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.tiktok.com/@monihomesfethiye?_t=ZS-8vJViveM0Bw&_r=1"
              aria-label="Tiktok"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-600 pt-4 text-center text-sm text-gray-400 flex items-center justify-center gap-6">
        © {new Date().getFullYear()} Monihomes. Tüm hakları saklıdır.
        <a href="/privacy-policy" className="page_footer_link">
          {t("footer.privacyPolicy")}
        </a>
      </div>
    </motion.footer>
  );
}
