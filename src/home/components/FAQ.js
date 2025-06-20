import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTranslatedPath } from "../../shared/hooks/useTranslatedPath";
import { NavLink } from "react-router";

export default function FAQ() {
    const roomPath = useTranslatedPath("roomInstructions");
    const { t } = useTranslation();
    const faqData = t("faq.questions", { returnObjects: true })
    return (
        <section className="py-16 lg:pb-24" id="faq">
            <div className="max-w-4xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-8">{t("faq.title")}</motion.h2>
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <FAQItem key={index} delay={index} faq={faq} />
                    ))}
                    <p className="border-b border-gray-300 py-4 text-lg font-medium text-left">
                        <NavLink to={roomPath} className="text-blue-600 underline hover:text-blue-800">
                            {t('roomInstructions.cta')}
                        </NavLink>
                    </p>
                </div>
            </div>
        </section>
    );
}

function FAQItem({ faq, delay }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div className="border-b border-gray-300 py-4"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay * 0.2 }}
            viewport={{ once: true }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between w-full text-lg font-medium text-left"
            >
                {faq.question}
                <span>{isOpen ? "▲" : "▼"}</span>
            </button>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden text-gray-600 mt-2"
            >
                {isOpen && <p>{faq.answer}</p>}
            </motion.div>
        </motion.div>
    );
}