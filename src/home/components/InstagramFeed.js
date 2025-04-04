import { useEffect } from "react";
import { useTranslation } from "react-i18next";
export default function InstagramFeed() {
    const { t } = useTranslation();
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <section className="py-20 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8">{t("instagram_title")}</h2>
            <div className="w-[860px] mx-auto flex justify-center ">
                <iframe
                    src="//lightwidget.com/widgets/e7e3ec062de952ac842112ebdb6d8be3.html"
                    scrolling="no"
                    allowTransparency="true"
                    className="lightwidget-widget w-full h-[500px] border-0 overflow-hidden"
                ></iframe>
            </div>
        </section>
    );
}
