import { useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaFacebook, FaVk, FaAirbnb } from "react-icons/fa";
export default function Contact() {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Backend API'ye gönderme işlemi yapılacak

        setLoading(true);

        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/sending_form", formValues);

            if (response.status === 200) {
            } else {
                throw new Error("Rezervasyon başarısız oldu.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
            alert("Mesajiniz basariyla gonderildi")
        }
    };

    return (
        <section className="py-10 bg-gray-100" id="contact">
            <div className="max-w-4xl mx-auto px-6">
                <motion.h2
                    className="text-3xl font-bold text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {t("contact_title")}
                </motion.h2>

                <motion.p
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {t("contact_description")}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <motion.h3 className="text-2xl font-semibold"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >{t("contact_info_title")}</motion.h3>
                        <motion.p initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}>
                            <a
                                href="tel:+905308997709"
                                className="text-blue-500 hover:underline"
                            >
                                <span className="text-gray-700 font-bold">{t("contact_phone")}</span>: +90 530 899 77 09
                            </a>
                        </motion.p>
                        <motion.p initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}>
                            <a
                                href="mailto:monihomes48@gmail.com"
                                className="text-blue-500 hover:underline"
                            >
                                <span className="text-gray-700 font-bold">{t("contact_email")}</span>: monihomes48@gmail.com
                            </a>
                        </motion.p>
                        <motion.p initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}>
                            <a
                                href="https://www.google.com/maps?q=Cumhuriyet,+93.+Sok+No:+4C,+48300+Fethiye/Muğla,+Türkiye"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                <span className="text-gray-700 font-bold">{t("contact_address")}</span>: Cumhuriyet, 93. Sok No: 4C, 48300 Fethiye/Muğla, Türkiye
                            </a>
                        </motion.p>

                        <div className="flex space-x-4 mt-10">
                            <motion.a
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                                href="https://instagram.com/monihomesfethiye?igshid=MzNlNGNkZWQ4Mg==" rel="noreferrer" target='_blank' className="text-2xl"><FaInstagram className="text-[#E4405F] text-3xl transition-colors duration-300 hover:text-[#C13584]" /></motion.a>
                            <motion.a
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                viewport={{ once: true }}
                                href="https://www.facebook.com/ugurdinc09/?mibextid=ZbWKwL" rel="noreferrer" target='_blank' className="text-2xl"><FaFacebook className="text-[#1877F2] text-3xl transition-colors duration-300 hover:text-[#0e5abf]" /></motion.a>
                            <motion.a
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                viewport={{ once: true }}
                                href="https://vk.com/dincugr" rel="noreferrer" target='_blank' className="text-2xl"><FaVk className="text-[#0077FF] text-3xl transition-colors duration-300 hover:text-[#0057b3]" /></motion.a>
                            <motion.a
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                viewport={{ once: true }}
                                href="https://tr.airbnb.com/rooms/910566787600271265?check_in=2025-04-22&check_out=2025-04-26&search_mode=regular_search&source_impression_id=p3_1743759994_P3Bojk9bonTKp7Kc&previous_page_section_name=1000&federated_search_id=9478a9ce-60d4-42ba-b4dd-ca7d48de8f80" rel="noreferrer" target='_blank' className="text-2xl"><FaAirbnb className="text-[#FF5A5F] text-3xl transition-colors duration-300 hover:text-[#E0484E]" /></motion.a>
                        </div>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="space-y-4 bg-white p-6 shadow-lg rounded-md"
                    >
                        <h3 className="text-2xl font-semibold">{t("contact_form_title")}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                                placeholder={t("contact_name_placeholder")}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                                placeholder={t("contact_email_placeholder")}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                required
                            />
                            <textarea
                                name="message"
                                value={formValues.message}
                                onChange={handleChange}
                                placeholder={t("contact_message_placeholder")}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
                            >
                                {!loading ? t("contact_submit_button") : <PulseLoader size={8} color={"white"} />}
                            </button>
                        </div>
                    </motion.form>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-12">
                    <h3 className="text-2xl font-semibold text-center">{t("contact_map_title")}</h3>
                    <div className="mt-6">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2231.823990600379!2d29.109808223703453!3d36.621938114854785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c0417d14b3f587%3A0xcb48dff072b01c2b!2sMoni%20Homes!5e0!3m2!1str!2sru!4v1687637006341!5m2!1str!2sru"
                            className="w-full h-72 border-0"
                            style={{ border: "0" }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title='monihomes'>

                        </iframe>
                    </div>
                </motion.div>
            </div>
        </section >
    );
}
