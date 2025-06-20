import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import owner from '../../assets/images/owner-profile.png'
export default function OwnerBanner() {
    const { t } = useTranslation();
    return (
        <section className="mt-10 lg:mt-20 py-6 lg:py-16 bg-gradient-to-r from-gray-100 to-gray-400 px-4 lg:px-8 xl:px-16">
            <div className="shadow-lg rounded-b-full sm:rounded-[1rem] p-6 container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                {/* Metin Bölümü */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-left"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4"> {t("owner.title")}</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        {t("owner.description")}
                    </p>
                    <p className="text-gray-700 font-semibold">- Uğur Dinç</p>
                </motion.div>

                {/* Fotoğraf Bölümü */}
                <div className="flex justify-center rounded-full">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        //    src={"https://i.ibb.co/fYfrP80v/owner-profile.webp"}
                        src={owner}
                        alt={t("owner.alt")}
                        className="w-48 h-48 rounded-full object-cover shadow-lg "
                    />
                </div>
            </div>
        </section>
    );
}
